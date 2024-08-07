import { Layout, sidebarPAItems } from "../Layout";
import { ThemeProps } from "../../../types/common.types";

const MahasiswaPA = ({ setTheme, currentTheme }: ThemeProps) => {
  return (
    <Layout
      setTheme={setTheme}
      currentTheme={currentTheme}
      sidebarItems={sidebarPAItems}
    >
      <h1 className="text-2xl font-bold">Mahasiswa Bimbingan Akademik</h1>
    </Layout>
  );
};

export default MahasiswaPA;
