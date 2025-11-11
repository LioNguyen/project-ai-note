import NavBar from "../../core/components/organisms/NavBar/NavBar";
import AIChatButton from "../../core/components/molecules/AIChatButton/AIChatButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="m-auto mx-6 max-w-full pt-24">{children}</main>
      <AIChatButton />
    </>
  );
}
