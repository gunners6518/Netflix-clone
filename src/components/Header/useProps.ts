import { useEffect, useState } from "react";
export const useProps = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // ① scrollが100を超えたか判定
    const handleShow = () => {
      setShow(window.scrollY > 100);
    };

　　　　　　　// ②イベントリスナーの設定
    window.addEventListener("scroll", handleShow);
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);

  return {
    show,
  };
};