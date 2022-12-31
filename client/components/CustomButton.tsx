import { ReactNode } from "react";
import Image from "next/image";
import MetaMask from "../images/MetaMask.svg";

interface Props {
  children?: ReactNode;
  btnType?: any;
  title?: any;
  handleClick?: any;
  styles?: any;
  logo?: any;
  // any props that come into the component
}

const CustomButton = ({ btnType, title, handleClick, styles, logo }: Props) => {
  return (
    <button
      type={btnType}
      className={`flex justify-start items-center gap-2 font-epilogue truncate max-w-[200px] font-semibold text-[16px] leading-[26px] bg-[#2952e3] text-white min-h-[52px] px-4 rounded-full ${styles}`}
      onClick={handleClick}
    >
        {logo && <Image src={MetaMask} alt="MetaMask" width={30} height={30} />}
      {title}
    </button>
  );
};

export default CustomButton;
