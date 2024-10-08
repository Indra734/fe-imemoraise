import { Layout, sidebarPAItems } from "../Layout";
import { ThemeProps } from "../../../types/common.types";
import useAxiosInstance from "../../../configs/axios.configs";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface dataDosenProps {
	nip: string;
	nama: string;
}

interface dataInfoMahasiswaPerAngkatanProps {
	tahun: string;
	jumlah: number;
}

interface dataListMahasiswaPerAngkatanProps {
	nim: string;
	nama: string;
}

const MahasiswaPA = ({ setTheme, currentTheme }: ThemeProps) => {

	const navigate = useNavigate();

	const axiosInstance = useAxiosInstance();
	const { keycloak } = useKeycloak();

	const [dataDosen, setDataDosen] = useState<dataDosenProps>();

	const [search, setSearch] = useState<string>("");
	const [angkatan, setAngkatan] = useState<string>("");

	const [dataInfoMahasiswaPerAngkatan, setDataInfoMahasiswaPerAngkatan] =
		useState<dataInfoMahasiswaPerAngkatanProps[]>([]);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [dataListMahasiswaPerAngkatan, setDataListMahasiswaPerAngkatan] =
		useState<dataListMahasiswaPerAngkatanProps[]>([]);

	// dapatkan nama dan nip dosen berdasarkan email yang dipakai dosen untuk login
	useEffect(() => {
		axiosInstance
			.get(`/dosen/info/${keycloak.tokenParsed?.email}`)
			.then((res) => res.data.data)
			.then((res) => {
				setDataDosen(res);
			});
	}, []);

	// dapatkan list total mahasiswa perangkatan (max 8 akt) untuk generate tombol filter by angkatan di sisi atas
	useEffect(() => {
		axiosInstance
			.get(`/dosen/mahasiswa/angkatan/info/${dataDosen?.nip}`)
			.then((res) => res.data.data)
			.then((res: dataInfoMahasiswaPerAngkatanProps[]) => {
				setDataInfoMahasiswaPerAngkatan(res);
				setAngkatan(res[0].tahun);
				console.log(res);
			});
	}, [dataDosen]);

	// dapatkan list detail mahasiswa perangkatan yang dipilih serta fitur search by nama & nim
	useEffect(() => {
		axiosInstance
			.get(
				`/dosen/mahasiswa?search=${search.toLowerCase()}&nip=${
					dataDosen?.nip
				}&angkatan=${angkatan}`
			)
			.then((res) => res.data.data)
			.then((res: dataListMahasiswaPerAngkatanProps[]) => {
				setDataListMahasiswaPerAngkatan(res);
				console.log(res);
			});
	}, [search, angkatan]);

	return (
		<Layout
			setTheme={setTheme}
			currentTheme={currentTheme}
			sidebarItems={sidebarPAItems}
			subpageTitle="Mahasiswa Bimbingan Anda"
		>
			<div className="flex flex-col p-1">
				<div className="flex gap-2">
					{dataInfoMahasiswaPerAngkatan.map(
						(angkatan: dataInfoMahasiswaPerAngkatanProps, index) => (
							<div
								className={`hover:cursor-pointer active:bg-primary/80 active:scale-105 ${
									activeIndex === index ? "bg-primary" : "bg-primary/40"
								} flex gap-2 p-2 rounded-t-xl justify-center items-center text-base-content font-semibold letter`}
								onClick={() => {
									setAngkatan(angkatan.tahun);
									setActiveIndex(index);
								}}
							>
								<span className="text-lg text-black">{angkatan.tahun}</span>
								<div className="badge bg-black p-3 border-none text-white">
									{angkatan.jumlah} mhs
								</div>
							</div>
						)
					)}
				</div>
				<div className="flex flex-col gap-4 w-full h-[calc(100vh-150px)] bg-base-200 p-4">
					<label className="input input-bordered flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="h-4 w-4 opacity-70"
						>
							<path
								fillRule="evenodd"
								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
								clipRule="evenodd"
							/>
						</svg>
						<input
							onInput={(e) => setSearch(e.currentTarget.value)}
							type="text"
							className="grow"
							placeholder="Cari mahasiswa berdasarkan Nama ataupun NIM..."
						/>
					</label>
					<div className="bg-base-100">
						<table className="table table-zebra w-full text-base text-center">
							<thead className="bg-base-300 text-base font-bold">
								<tr>
									<th className="w-16">No.</th>
									<th className="w-96">NIM</th>
									<th className="w-96">Nama Mahasiswa</th>
									<th>Aksi</th>
								</tr>
							</thead>
							<tbody>
								{dataListMahasiswaPerAngkatan.map(
									(mahasiswa: dataListMahasiswaPerAngkatanProps, index) => (
										<tr key={index}>
											<td className="w-16">{index + 1}.</td>
											<td className="w-96">{mahasiswa.nim}</td>
											<td className="w-96">{mahasiswa.nama}</td>
											<td>
												<button
													onClick={() => {
                            navigate(`/pa/mahasiswa/setoran?nama=${mahasiswa.nama}&nim=${mahasiswa.nim}&nip=${dataDosen?.nip}`);
													}}
													className="btn btn-primary rounded-xs btn-outline"
												>
													Lihat Detail
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="w-4 h-4 transform -rotate-45"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M14 5l7 7m0 0l-7 7m7-7H3"
														/>
													</svg>
												</button>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default MahasiswaPA;
