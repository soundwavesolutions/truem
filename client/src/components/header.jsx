import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="">
      <div className="pt-6 mx-auto w-full px-[15px] max-w-[1280px] max-lg:max-w-[768px] max-md:max-w-[578px] max-sm:max-w-[420px]">
        <Link to="/">
          <img
            src="/images/Logo.svg"
            alt="Truist Bank | Checking, Savings, Lending, and Financial Services"
            height={45}
            width={150}
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;
