import { useEffect, useRef, useState } from "react";
import AuthUser from "./AuthUser";
import { useNavigate } from "react-router-dom";
import LogoVistaSoft from "../assets/img/logo-vistasoft.png";
import Header from "../components/Header";
import Config from "../Config";
import Navbar from "../components/Navbar";
import axios from "axios";

const Login = () => {
  const { getToken, setToken } = AuthUser();
  const { getRol } = AuthUser();
  const [contrasenia, setContrasenia] = useState("");
  const [cod_sis, setCodigo] = useState("");

  const [nombre_usuario, setUsuario] = useState("");

  const navigate = useNavigate();

  // Referencias para los elementos
  const passwordInputRef1 = useRef(null);
  const showPasswordCheckboxRef1 = useRef(null);
  const passwordInputRef2 = useRef(null);
  const showPasswordCheckboxRef2 = useRef(null);
  const botonDocenteForm1Ref = useRef(null);
  const botonEstudianteForm2Ref = useRef(null);
  const formEstudianteRef = useRef(null);
  const formDocenteRef = useRef(null);
  const handleReset = () => {
    setContrasenia("");
  };
  useEffect(() => {
    // Redirigir si ya está autenticado
    if (getToken()) {
      if (getRol() === "docente") navigate("/docente");
      if (getRol() === "estudiante") navigate("/estudiante");
    }

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = (passwordRef, checkboxRef) => {
      if (passwordRef.current && checkboxRef.current) {
        passwordRef.current.type = checkboxRef.current.checked
          ? "text"
          : "password";
      }
    };

    // Función para cambiar entre formularios
    const switchFormVisibility = (formToShow, formToHide) => {
      if (formToShow.current && formToHide.current) {
        formToShow.current.classList.remove("hidden");
        formToHide.current.classList.add("hidden");
        handleReset();
      }
    };

    // Agregar listeners solo si las referencias existen
    if (showPasswordCheckboxRef1.current && passwordInputRef1.current) {
      showPasswordCheckboxRef1.current.addEventListener("change", () =>
        togglePasswordVisibility(passwordInputRef1, showPasswordCheckboxRef1),
      );
    }
    if (showPasswordCheckboxRef2.current && passwordInputRef2.current) {
      showPasswordCheckboxRef2.current.addEventListener("change", () =>
        togglePasswordVisibility(passwordInputRef2, showPasswordCheckboxRef2),
      );
    }
    if (botonDocenteForm1Ref.current) {
      botonDocenteForm1Ref.current.addEventListener("click", () =>
        switchFormVisibility(formDocenteRef, formEstudianteRef),
      );
    }
    if (botonEstudianteForm2Ref.current) {
      botonEstudianteForm2Ref.current.addEventListener("click", () =>
        switchFormVisibility(formEstudianteRef, formDocenteRef),
      );
    }

    // Limpiar listeners al desmontar el componente
    return () => {
      if (showPasswordCheckboxRef1.current && passwordInputRef1.current) {
        showPasswordCheckboxRef1.current.removeEventListener("change", () =>
          togglePasswordVisibility(passwordInputRef1, showPasswordCheckboxRef1),
        );
      }
      if (showPasswordCheckboxRef2.current && passwordInputRef2.current) {
        showPasswordCheckboxRef2.current.removeEventListener("change", () =>
          togglePasswordVisibility(passwordInputRef2, showPasswordCheckboxRef2),
        );
      }
      if (botonDocenteForm1Ref.current) {
        botonDocenteForm1Ref.current.removeEventListener("click", () =>
          switchFormVisibility(formDocenteRef, formEstudianteRef),
        );
      }
      if (botonEstudianteForm2Ref.current) {
        botonEstudianteForm2Ref.current.removeEventListener("click", () =>
          switchFormVisibility(formEstudianteRef, formDocenteRef),
        );
      }
    };
  }, [getToken, navigate]);

  const submitLogin = async (e) => {
    e.preventDefault();
    await axios.get("/sanctum/csrf-cookie").then((response) => {
      Config.getLogin({ contrasenia, cod_sis }).then(({ data }) => {
        console.log("Success:", data.success); // Muestra el estado success en la consola
        if (data.success) {
          setToken(data.user, data.token, data.user.roles[0].name);
          localStorage.setItem("authToken", data.token);
          console.log("Token:", data.token); // Muestra el token en la consola
        } else {
          alert("Credenciales incorrectas");
          console.log(data.message);
        }
      });
    });
  };

  const submitLoginDoc = async (e) => {
    e.preventDefault();
    await axios.get("/sanctum/csrf-cookie").then((response) => {
      Config.getLoginDoc({ nombre_usuario, contrasenia }).then(({ data }) => {
        console.log("Success:", data.success); // Muestra el estado success en la consola
        if (data.success) {
          setToken(data.user, data.token, data.user.roles[0].name);
          localStorage.setItem("authToken", data.token);
          console.log("Token:", data.token); // Muestra el token en la consola
        } else {
          alert("Credenciales incorrectas");
          console.log(data.message);
        }
      });
    });
  };

  const botonesNavbar = [{ nombreBoton: "Inicio", hrefBoton: "/" }];

  return (
    <>
      <Header nombreBoton={"Registrarse"} hrefBoton={"./register"} />
      <Navbar botones={botonesNavbar} />
      <main className="relative top-32 py-12 sm:pt-12 background w-full">
        <form
          onSubmit={submitLogin}
          ref={formEstudianteRef}
          className="mx-auto w-80 overflow-hidden rounded-md bg-slate-200 bg-opacity-80"
        >
          <div className="flex">
            <div className="w-1/2 select-none p-3 text-center font-semibold text-zinc-600 hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60">
              Estudiante
            </div>
            <div
              ref={botonDocenteForm1Ref}
              className="w-1/2 select-none bg-zinc-400 bg-opacity-60 p-3 text-center font-semibold text-zinc-600 transition-colors hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60"
            >
              Docente
            </div>
          </div>

          <div className="p-8">
            <img className="h-7" src={LogoVistaSoft} alt="LogoVistaSoft" />
            <h1 className="my-4 text-3xl font-semibold text-slate-800">
              Iniciar sesión
            </h1>

            <label htmlFor="codigo" className="font-semibold text-slate-800">
              Código SISS
            </label>
            <br />
            <input
              type="text"
              id="codigo"
              className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
              value={cod_sis}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <br />

            <label
              htmlFor="password-1"
              className="font-semibold text-slate-800"
            >
              Contraseña
            </label>
            <br />
            <input
              ref={passwordInputRef1}
              type="password"
              id="password-1"
              className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
            />
            <br />

            <div className="my-1 flex items-center gap-1">
              <input
                ref={showPasswordCheckboxRef1}
                type="checkbox"
                id="show-password-1"
                className="cursor-pointer"
              />
              <label
                htmlFor="show-password-1"
                className="cursor-pointer select-none text-sm text-slate-800"
              >
                Mostrar contraseña
              </label>
            </div>

            <button
              onClick={submitLogin}
              className="mt-2 w-full rounded-md bg-slate-800 p-2 font-semibold text-slate-100 shadow-md transition-colors hover:bg-slate-700"
            >
              Iniciar sesión
            </button>

            <div className="mt-2 flex justify-center">
              <a
                href="/register"
                className="text-center text-xs text-slate-800 transition-colors hover:underline hover:decoration-slate-800"
              >
                ¿No tienes una cuenta? <strong>Registrate</strong>
              </a>
            </div>
          </div>
        </form>

        <form
          onSubmit={submitLoginDoc}
          ref={formDocenteRef}
          className="mx-auto hidden w-80 overflow-hidden rounded-md bg-slate-200 bg-opacity-80"
        >
          <div className="flex">
            <div
              ref={botonEstudianteForm2Ref}
              className="w-1/2 select-none bg-zinc-400 bg-opacity-60 p-3 text-center font-semibold text-zinc-600 transition-colors hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60"
            >
              Estudiante
            </div>
            <div className="w-1/2 select-none p-3 text-center font-semibold text-zinc-600 hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60">
              Docente
            </div>
          </div>

          <div className="p-8">
            <img className="h-7" src={LogoVistaSoft} alt="LogoVistaSoft" />
            <h1 className="my-4 text-3xl font-semibold text-slate-800">
              Iniciar sesión
            </h1>

            <label htmlFor="user" className="font-semibold text-slate-800">
              Usuario
            </label>
            <br />
            <input
              type="text"
              id="user"
              className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
              value={nombre_usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <br />

            <label
              htmlFor="password-2"
              className="font-semibold text-slate-800"
            >
              Contraseña
            </label>
            <br />
            <input
              ref={passwordInputRef2}
              type="password"
              id="password-2"
              className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
            />
            <br />

            <div className="my-1 flex items-center gap-1">
              <input
                ref={showPasswordCheckboxRef2}
                type="checkbox"
                id="show-password-2"
                className="cursor-pointer"
              />
              <label
                htmlFor="show-password-2"
                className="cursor-pointer select-none text-sm text-slate-800"
              >
                Mostrar contraseña
              </label>
            </div>

            <button
              onClick={submitLoginDoc}
              type="submit"
              className="mt-2 w-full rounded-md bg-slate-800 p-2 font-semibold text-slate-100 shadow-md transition-colors hover:bg-slate-700"
            >
              Iniciar sesión
            </button>

            <div className="mt-2 flex justify-center">
              <a
                href="/register"
                className="text-center text-xs text-slate-800 transition-colors hover:underline hover:decoration-slate-800"
              >
                ¿No tienes una cuenta? <strong>Registrate</strong>
              </a>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default Login;
