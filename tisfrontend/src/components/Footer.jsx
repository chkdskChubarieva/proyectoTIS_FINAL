import logo_vistasoft from "../assets/img/logo-vistasoft.png";

const Footer = () => {
  return (
    <>
      <footer
        id="contacto"
        className="flex flex-col justify-between gap-8 bg-zinc-50 px-6 py-8 sm:px-12 md:flex-row md:gap-0"
      >
        <div className="space-y-2">
          <span className="text-lg font-semibold text-zinc-500">Contacto</span>

          <div className="flex items-center gap-2">
            <i className="fa-solid fa-envelope text-zinc-500"></i>
            <p className="text-zinc-500">vistasoft.solutions@gmail.com</p>
          </div>

          <div className="flex items-center gap-2">
            <i className="fa-solid fa-phone text-zinc-500"></i>
            <p className="text-zinc-500">+591-75468783</p>
          </div>

          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-zinc-500"></i>
            <p className="text-zinc-500">
              Av. Fray Domingo Santo Tomás y c/ Ismael Vásquez #1480
            </p>
          </div>
        </div>

        <div className="my-auto flex flex-col items-center md:items-end">
          <img className="w-48" src={logo_vistasoft} alt="" />
          <p className="text-lg font-semibold text-zinc-400">
            &copy; 2024 - VistaSoft Solutions
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
