import { useState, useEffect, useRef } from "react";
import Config from "../Config";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import LogoVistaSoft from "../assets/img/logo-vistasoft.png";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const Register = () => {
  const { getToken } = AuthUser();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [correo, setCorreo] = useState("");

  //const [nombreDoc, setNombreDoc] = useState("");
  //const [apellidoDoc, setApellidoDoc] = useState("");
  //const [contraseniaDoc, setContraseniaDoc] = useState("");
  //const [correoDoc, setCorreoDoc] = useState("");
  const [cod_sis, setCodigo] = useState("");
  const [nombre_usuario, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordDocenteError, setPasswordDocenteError] = useState("");
  const navigate = useNavigate();

  const passwordInput = useRef(null);
  const passwordConfInput = useRef(null);
  const showPasswordCheckbox = useRef(null);

  const passwordDocenteInput = useRef(null);
  const passwordDocenteConfInput = useRef(null);
  const showPasswordDocenteCheckbox = useRef(null);

  const [formDocenteVisible, setFormDocenteVisible] = useState(false);
  const [formEstudianteVisible, setFormEstudianteVisible] = useState(true);

  const mostrarFormDocente = () => {
    handleReset();
    setFormDocenteVisible(true);
    setFormEstudianteVisible(false);
  };

  const mostrarFormEstudiante = () => {
    handleReset();
    setFormDocenteVisible(false);
    setFormEstudianteVisible(true);
  };

  const handleReset = () => {
    setNombre("");
    setApellido("");
    setContrasenia("");
    setCorreo("");
  };

  useEffect(() => {
    if (getToken()) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const submitRegistro = async (e) => {
    e.preventDefault();

    // Validación de correo institucional y contraseña
    if (!correo.endsWith("@est.umss.edu")) {
      setEmailError("Debe usar su correo institucional");
      alert("Debe usar su correo institucional");
      return;
    } else {
      setEmailError("");
    }

    if (contrasenia !== passwordConfInput.current.value) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    } else {
      setPasswordError("");
    }
    if (contrasenia.length <= 5) {
      setPasswordError("La contraseña es menor a 5 caracteres");
      return;
    } else {
      setPasswordError("");
    }

    if (!/^[a-z0-9]*$/gi.test(contrasenia)) {
      setPasswordError("La contraseña no es alfanumérica");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const { data } = await Config.getRegister({
        nombre,
        apellido,
        contrasenia,
        correo,
        cod_sis,
      });
      console.log(data);
      if (data.success) {
        navigate("/login");
      } else {
        if (data.cod_sis) {
          alert("El código SIS ya se encuentra registrado.");
          navigate("/register");
        } else {
          alert("Error en el registro");
          navigate("/register");
        }
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Ocurrió un error durante el registro");
      navigate("/register");
    }
  };

  const submitRegistroDoc = async (e) => {
    e.preventDefault();
    //Error con los set, no se actualizan al mismo tiempo que se le da al boton de submit
    //setNombre(nombreDoc)
    //setApellido(apellidoDoc)
    //setContrasenia(contraseniaDoc)
    //setCorreo(correoDoc)
    // Validación de correo institucional y contraseña
    if (!correo.endsWith("@umss.edu")) {
      setEmailError("Debe usar su correo institucional");
      alert("Debe usar su correo institucional");
      return;
    } else {
      setEmailError("");
    }

    if (contrasenia !== passwordDocenteConfInput.current.value) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    } else {
      setPasswordError("");
    }
    if (contrasenia.length <= 5) {
      setPasswordError("La contraseña es menor a 5 caracteres");
      return;
    } else {
      setPasswordError("");
    }

    if (!/^[a-z0-9]*$/gi.test(contrasenia)) {
      setPasswordError("La contraseña no es alfanumérica");
      return;
    } else {
      setPasswordError("");
    }
    try {
      const { data } = await Config.getRegisterDoc({
        nombre,
        apellido,
        contrasenia,
        correo,
        nombre_usuario,
      });
      console.log(data);
      if (data.success) {
        navigate("/login");
      } else {
        // Manejar otros posibles errores del backend
        if (data.cod_sis) {
          alert("El código SIS ya se encuentra registrado.");
          navigate("/register");
        } else {
          alert("Error en el registro");
          navigate("/register");
        }
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Ocurrió un error durante el registro");
    }
  };

  const togglePasswordVisibility = () => {
    const isChecked = showPasswordCheckbox.current?.checked;
    if (passwordInput.current) {
      passwordInput.current.type = isChecked ? "text" : "password";
    }
    if (passwordConfInput.current) {
      passwordConfInput.current.type = isChecked ? "text" : "password";
    }
  };

  // Manejadores de eventos de React en lugar de addEventListener
  const handlePasswordChange = (e) => {
    setContrasenia(e.target.value);
    if (
      passwordConfInput.current &&
      e.target.value !== passwordConfInput.current.value
    ) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordConfirmChange = (e) => {
    if (
      passwordInput.current &&
      e.target.value !== passwordInput.current.value
    ) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const botonesNavbar = [{ nombreBoton: "Inicio", hrefBoton: "/" }];

  //validacion para formulario de docente
  const handlePasswordDocenteChange = (e) => {
    setContrasenia(e.target.value);
    if (
      passwordDocenteConfInput.current &&
      e.target.value !== passwordDocenteConfInput.current.value
    ) {
      setPasswordDocenteError("Las contraseñas no coinciden");
    } else {
      setPasswordDocenteError("");
    }
  };

  const handlePasswordDocenteConfirmChange = (e) => {
    if (
      passwordDocenteInput.current &&
      e.target.value !== passwordDocenteInput.current.value
    ) {
      setPasswordDocenteError("Las contraseñas no coinciden");
    } else {
      setPasswordDocenteError("");
    }
  };

  const toggleDocentePasswordVisibility = () => {
    const isChecked = showPasswordDocenteCheckbox.current?.checked;
    if (passwordDocenteInput.current) {
      passwordDocenteInput.current.type = isChecked ? "text" : "password";
    }
    if (passwordDocenteConfInput.current) {
      passwordDocenteConfInput.current.type = isChecked ? "text" : "password";
    }
  };

  return (
    <>
      <Header nombreBoton={"Iniciar sesión"} hrefBoton={"/login"} />
      <Navbar botones={botonesNavbar} />

      <main className="relative top-32 py-12 sm:pt-12 background w-full">
        {formEstudianteVisible && (
          <form
            method="POST"
            id="formEstudiante"
            className="mx-auto w-80 max-w-lg overflow-hidden rounded-md bg-slate-200 bg-opacity-80 sm:w-fit"
            onSubmit={submitRegistro}
          >
            <div className="flex">
              <div
                className="w-1/2 select-none p-3 text-center font-semibold text-zinc-600 hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60"
                onClick={mostrarFormEstudiante}
              >
                Estudiante
              </div>
              <div
                className="w-1/2 select-none bg-zinc-400 bg-opacity-60 p-3 text-center font-semibold text-zinc-600 transition-colors hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60"
                onClick={mostrarFormDocente}
              >
                <a className="selector-doc">Docente</a>
              </div>
            </div>
            <div className="p-8">
              <img className="h-7" src={LogoVistaSoft} alt="logo-vistasoft" />
              <h1 className="my-4 text-3xl font-semibold text-slate-800">
                Registrarse (Estudiante)
              </h1>

              <div className="flex flex-col sm:flex-row sm:gap-5">
                <div className="sm:w-1/2">
                  <label
                    htmlFor="nombre"
                    className="font-semibold text-slate-800"
                  >
                    Nombre(s)
                  </label>
                  <br />
                  <input
                    type="text"
                    id="nombre"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={nombre}
                    onChange={(e) => {
                      const valor = e.target.value;
                      // Permitir solo letras, espacios y caracteres específicos como acentos
                      if (
                        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor) &&
                        valor.length <= 30
                      ) {
                        setNombre(valor);
                      }
                    }}
                    required
                  />
                  <br />
                </div>

                <div className="sm:w-1/2">
                  <label
                    htmlFor="apellido"
                    className="font-semibold text-slate-800"
                  >
                    Apellido(s)
                  </label>
                  <br />
                  <input
                    type="text"
                    id="apellido"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={apellido}
                    onChange={(e) => {
                      const valor = e.target.value;
                      // Permitir solo letras, espacios y caracteres específicos como acentos
                      if (
                        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor) &&
                        valor.length <= 30
                      ) {
                        setApellido(valor);
                      }
                    }}
                    required
                  />
                  <br />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-5">
                <div className="sm:w-1/2">
                  <label
                    htmlFor="codigo"
                    className="font-semibold text-slate-800"
                  >
                    Código SISS
                  </label>
                  <br />
                  <input
                    type="number"
                    id="codigo"
                    className="[&::-moz-appearance]:textfield my-1 w-full appearance-none rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={cod_sis}
                    onChange={(e) => {
                      if (e.target.value.length <= 9) {
                        setCodigo(e.target.value);
                      }
                    }}
                    required
                  />
                  <br />
                </div>

                <div className="sm:w-1/2">
                  <label
                    htmlFor="correo"
                    className="font-semibold text-slate-800"
                  >
                    Correo electrónico
                  </label>
                  <br />
                  <input
                    type="email"
                    id="correo"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onBlur={(e) => {
                      if (!e.target.value.endsWith("@est.umss.edu")) {
                        setEmailError("Debe usar su correo institucional");
                      } else {
                        setEmailError("");
                      }
                    }}
                    required
                  />
                  <br />

                  {emailError && (
                    <span className="flex text-xs text-red-500">
                      {emailError}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-5">
                <div className="sm:w-1/2">
                  <label
                    htmlFor="password"
                    className="font-semibold text-slate-800"
                  >
                    Contraseña
                  </label>
                  <br />
                  <input
                    ref={passwordInput}
                    type="password"
                    id="password"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={contrasenia}
                    onChange={handlePasswordChange}
                    required
                  />
                  <br />
                </div>

                <div className="sm:w-1/2">
                  <label
                    htmlFor="conf-password"
                    className="font-semibold text-slate-800"
                  >
                    Confirmar contraseña
                  </label>
                  <br />
                  <input
                    ref={passwordConfInput}
                    type="password"
                    id="conf-password"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    onChange={handlePasswordConfirmChange}
                    required
                  />
                  <br />
                </div>
              </div>

              <div className="my-1 flex w-full items-center justify-between">
                <div className="flex gap-1">
                  <input
                    ref={showPasswordCheckbox}
                    type="checkbox"
                    id="show-password"
                    className="cursor-pointer"
                    onChange={togglePasswordVisibility}
                  />
                  <label
                    htmlFor="show-password"
                    className="cursor-pointer select-none text-sm text-slate-800"
                  >
                    Mostrar contraseña
                  </label>
                </div>

                <span className="text-xs text-red-500">{passwordError}</span>
              </div>

              <button
                type="submit"
                onClick={submitRegistro}
                className="mt-2 w-full rounded-md bg-slate-800 p-2 font-semibold text-slate-100 shadow-md transition-colors hover:bg-slate-700"
              >
                Registrarse
              </button>

              <div className="mt-2 flex justify-center">
                <a
                  href="/login"
                  className="text-center text-xs text-slate-800 transition-colors hover:underline hover:decoration-slate-800"
                >
                  ¿Ya tienes una cuenta? <strong>Inicia sesión</strong>
                </a>
              </div>
            </div>
          </form>
        )}
        {formDocenteVisible && (
          <form
            method="POST"
            id="formDocente"
            className="mx-auto w-80 max-w-lg overflow-hidden rounded-md bg-slate-200 bg-opacity-80 sm:w-fit"
            onSubmit={submitRegistroDoc}
          >
            <div className="flex">
              <div
                className="w-1/2 select-none bg-zinc-400 bg-opacity-60 p-3 text-center font-semibold text-zinc-600 transition-colors hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60"
                onClick={mostrarFormEstudiante}
              >
                Estudiante
              </div>
              <div
                className="w-1/2 select-none p-3 text-center font-semibold text-zinc-600 hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-60"
                onClick={mostrarFormDocente}
              >
                Docente
              </div>
            </div>
            <div className="p-8">
              <img className="h-7" src={LogoVistaSoft} alt="logo-vistasoft" />
              <h1 className="my-4 flex text-3xl font-semibold text-slate-800">
                Registrarse (Docente)
              </h1>

              <div className="flex flex-col sm:flex-row sm:gap-5">
                <div className="sm:w-1/2">
                  <label
                    htmlFor="nombreDoc"
                    className="font-semibold text-slate-800"
                  >
                    Nombre(s)
                  </label>
                  <br />
                  <input
                    type="text"
                    id="nombreDoc"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={nombre}
                    onChange={(e) => {
                      const valor = e.target.value;
                      // Permitir solo letras, espacios y caracteres específicos como acentos
                      if (
                        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor) &&
                        valor.length <= 30
                      ) {
                        setNombre(valor);
                      }
                    }}
                    required
                  />
                  <br />
                </div>

                <div className="sm:w-1/2">
                  <label
                    htmlFor="apellidoDoc"
                    className="font-semibold text-slate-800"
                  >
                    Apellido(s)
                  </label>
                  <br />
                  <input
                    type="text"
                    id="apellidoDoc"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={apellido}
                    onChange={(e) => {
                      const valor = e.target.value;
                      // Permitir solo letras, espacios y caracteres específicos como acentos
                      if (
                        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor) &&
                        valor.length <= 30
                      ) {
                        setApellido(valor);
                      }
                    }}
                    required
                  />
                  <br />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-5">
                <div className="sm:w-1/2">
                  <label
                    htmlFor="usuarioDoc"
                    className="font-semibold text-slate-800"
                  >
                    Usuario
                  </label>
                  <br />
                  <input
                    type="text"
                    id="usuarioDoc"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={nombre_usuario}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <br />
                </div>

                <div className="sm:w-1/2">
                  <label
                    htmlFor="correoDoc"
                    className="font-semibold text-slate-800"
                  >
                    Correo electrónico
                  </label>
                  <br />
                  <input
                    type="email"
                    id="correoDoc"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                  <br />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-5">
                <div className="sm:w-1/2">
                  <label
                    htmlFor="passwordDoc"
                    className="font-semibold text-slate-800"
                  >
                    Contraseña
                  </label>
                  <br />
                  <input
                    ref={passwordDocenteInput}
                    type="password"
                    id="passwordDoc"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    onChange={handlePasswordDocenteChange}
                    value={contrasenia}
                    required
                  />
                  <br />
                </div>

                <div className="sm:w-1/2">
                  <label
                    htmlFor="conf-passwordDoc"
                    className="font-semibold text-slate-800"
                  >
                    Confirmar contraseña
                  </label>
                  <br />
                  <input
                    ref={passwordDocenteConfInput}
                    type="password"
                    id="conf-passwordDoc"
                    className="my-1 w-full rounded-md border border-slate-800 bg-slate-100 bg-opacity-50 px-2 py-1"
                    onChange={handlePasswordDocenteConfirmChange}
                    required
                  />
                  <br />
                </div>
              </div>

              <div className="my-1 flex w-full items-center justify-between">
                <div className="flex gap-1">
                  <input
                    ref={showPasswordDocenteCheckbox}
                    type="checkbox"
                    id="show-passwordDoc"
                    className="cursor-pointer"
                    onChange={toggleDocentePasswordVisibility}
                  />
                  <label
                    htmlFor="show-passwordDoc"
                    className="cursor-pointer select-none text-sm text-slate-800"
                  >
                    Mostrar contraseña
                  </label>
                </div>

                <span className="text-xs text-red-500">
                  {passwordDocenteError}
                </span>
              </div>

              <button
                type="submit"
                onClick={submitRegistroDoc}
                className="mt-2 w-full rounded-md bg-slate-800 p-2 font-semibold text-slate-100 shadow-md transition-colors hover:bg-slate-700"
              >
                Registrarse
              </button>

              <div className="mt-2 flex justify-center">
                <a
                  href="/login"
                  className="text-center text-xs text-slate-800 transition-colors hover:underline hover:decoration-slate-800"
                >
                  ¿Ya tienes una cuenta? <strong>Inicia sesión</strong>
                </a>
              </div>
            </div>
          </form>
        )}
      </main>
    </>
  );
};

export default Register;
