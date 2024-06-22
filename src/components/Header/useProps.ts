import { useEffect, useState } from "react";
export const useProps = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleShow = () => {
      setShow(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleShow);
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);

  return {
    show,
  };
};