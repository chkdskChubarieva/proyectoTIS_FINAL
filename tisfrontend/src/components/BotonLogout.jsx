/* eslint-disable react/prop-types */
import AuthUser from "../pageauth/AuthUser";
import Config from "../Config";

const BotonLogout = ({ hrefBoton, nombreBoton }) => {
  const { getLogout } = AuthUser();

  const logoutUser = () => {
    Config.getLogout("/logout").then((response) => {
      getLogout();
      console.log(response);
    });
  };

  return (
    <>
      <a
        href={hrefBoton}
        className="flex select-none items-center justify-center gap-2 rounded bg-red-600 p-2 text-white transition-all hover:bg-red-500 hover:shadow"
        onClick={logoutUser}
      >
        <i className="fa-solid fa-right-from-bracket"></i>
        {nombreBoton}
      </a>
    </>
  );
};

export default BotonLogout;
