/* eslint-disable react/prop-types */

const BotonSidebar = ({ toggleSidebar }) => {
  return (
    <i
      className="fa-solid fa-bars left-5 cursor-pointer rounded bg-white bg-opacity-0 px-3 py-2 text-2xl text-slate-200 transition-colors hover:bg-opacity-5 md:hidden"
      onClick={toggleSidebar}
    ></i>
  );
};

export default BotonSidebar;
