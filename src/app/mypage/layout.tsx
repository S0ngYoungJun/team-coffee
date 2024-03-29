import SideNav from '@/components/mypage/sidenav';
import styles from "@/styles/mypage.module.scss";
import Topbar from "@/components/Topbar/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="en">
    <body>
    <div className={styles.main}>
      <div className={styles.top}><Topbar /></div>
      <div className={styles.side}>
        <SideNav />
      </div>
      <div className={styles.content}>{children}</div>
      <div id="global-modal"></div>
    </div>
    </body>
  </html>
  );
}