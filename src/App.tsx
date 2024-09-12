import { ThemeProvider } from "next-themes";
import { SidebarUi } from "./components/sidebar-ui";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarUi />
    </ThemeProvider>
  );
}

export default App;
