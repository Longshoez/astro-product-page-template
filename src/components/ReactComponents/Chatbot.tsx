import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import { useMediaQuery } from "react-responsive";
import useResponsiveness from "../../utils/useResponsiveness";

import Button from "./Button";


interface Question {
  id: number;
  text: string;
  options: string[];
  type?: string;
}

interface EnfermedadData {
  ajuste: number;
  horas: number;
  meses: number[];
}

const ChatBot = () => {
  const { mobile } = useResponsiveness();

  // Constantes
  const questions: Question[] = [
    {
      id: 1,
      text: "Bienvenido a nuestro asistente de evaluación. ¿Deseas saber cual es tu dosis correcta de ayahuasca para sanar?",
      options: ["Sí, continuar", "Más información", "No, gracias"],
    },
    {
      id: 2,
      text: "¿Cuántos años tienes?",
      options: [
        "De 17 a 34 años",
        "De 35 a 54 años",
        "De 55 a 74 años",
        "De 75 a más",
      ],
    },
    {
      id: 3,
      text: "¿Cuál es tu peso actual?",
      options: [
        "De 40 a 54 kg",
        "De 55 a 64 kg",
        "De 65 a 84 kg",
        "De 85 kg a más",
      ],
    },
    {
      id: 4,
      text: "¿Tienes algún diagnóstico?",
      options: ["Sí", "No"],
    },
    {
      id: 5,
      text: "¿Qué diagnóstico tienes?",
      options: [
        "Ansiedad",
        "Depresión",
        "Diabetes",
        "Migraña",
        "Presión Alta",
        "Presión Baja",
        "Insomnio",
        "Gastritis",
        "Hipertiroidismo",
        "Hipotiroidismo",
        "Cáncer",
        "Artritis",
        "Artrosis",
        "Parkinson",
        "Alzheimer",
        "Asma",
        "Próstata",
        "Dermatitis",
        "Hepatitis",
        "Colon Irritable",
        "ETS",
        "Esquizofrenia",
        "Paranoia",
        "Demencia",
        "TDH",
        "TLP",
        "Bipolaridad"
      ],
    },
    {
      id: 6,
      text: "¿Toma algún medicamento?",
      options: ["Sí", "No"],
    },
    {
      id: 7,
      text: "¿En qué momento del día tomas tus medicamentos?",
      type: "multiselect",
      options: ["Mañana", "Tarde", "Noche"],
    },
    {
      id: 8,
      text: "¿Qué estás buscando con la microdosis?",
      options: [
        "Despertar espiritual y meditación",
        "Mejorar la concentración y creatividad",
        "Mejorar calidad de sueño",
        "Más energía y productividad",
      ],
    },
  ];

  const resultInfo: Record<string, string> = {
    "Más información":
      "Este cuestionario evalúa la aptitud para el uso de la microdosis de ayahuasca. Es importante responder con honestidad para recibir recomendaciones apropiadas. Los resultados son orientativos y no reemplazan la consulta profesional.",

    "No, gracias":
      "Entendemos. Si en otro momento deseas realizar la evaluación, estaremos aquí para ayudarte.",
  };

  // Valores de gotas por edad
  const edadGotas: Record<string, number> = {
    "De 17 a 34 años": 6,
    "De 35 a 54 años": 7,
    "De 55 a 74 años": 5,
    "De 75 a más": 4,
  };

  // Valores de gotas por peso
  const pesoGotas: Record<string, number> = {
    "De 40 a 54 kg": 5,
    "De 55 a 64 kg": 7,
    "De 65 a 84 kg": 8,
    "De 85 kg a más": 7,
  };

  // Valores de ajuste por enfermedad con horas de espera
  const enfermedadData: Record<string, EnfermedadData> = {
    Ansiedad: { ajuste: 1, horas: 1, meses: [3, 4] },
    Depresión: { ajuste: 1, horas: 1, meses: [3, 4] },
    Diabetes: { ajuste: 2, horas: 2, meses: [4, 7] },
    Migraña: { ajuste: 1, horas: 1, meses: [4, 7] },
    "Presión Alta": { ajuste: 2, horas: 2, meses: [8, 10] },
    "Presión Baja": { ajuste: 2, horas: 2, meses: [8, 10] },
    Insomnio: { ajuste: 1, horas: 1, meses: [3, 4] },
    Gastritis: { ajuste: 3, horas: 2, meses: [3, 4] },
    Hipertiroidismo: { ajuste: 3, horas: 2, meses: [8, 10] },
    Hipotiroidismo: { ajuste: 3, horas: 2, meses: [8, 10] },
    Cáncer: {
      ajuste: 3, horas: 3, meses: [12]
    },
    Artritis: { ajuste: 3, horas: 2, meses: [12] },
    Artrosis: { ajuste: 3, horas: 2, meses: [12] },
    Parkinson: { ajuste: 4, horas: 1, meses: [12] },
    Alzheimer: { ajuste: 4, horas: 1, meses: [12] },
    Asma: { ajuste: 2, horas: 1, meses: [4, 7] },
    Próstata: { ajuste: 2, horas: 1, meses: [8, 10] },
    Dermatitis: { ajuste: 2, horas: 1, meses: [4, 7] },
    Hepatitis: { ajuste: 3, horas: 1, meses: [8, 10] },
    "Colon Irritable": { ajuste: 3, horas: 1, meses: [4, 7] },
    ETS: { ajuste: 4, horas: 3, meses: [12] },
    Esquizofrenia: { ajuste: -1, horas: 2, meses: [12] },
    Paranoia: { ajuste: -1, horas: 2, meses: [12] },
    Demencia: { ajuste: -2, horas: 2, meses: [12] },
    TDH: { ajuste: 1, horas: 1, meses: [12] },
    TLP: { ajuste: 1, horas: 1, meses: [12] },
    Bipolaridad: { ajuste: 1, horas: 1, meses: [12] },
  };

  // Estados
  const [chatVisible, setChatVisible] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [gotasCalculadas, setGotasCalculadas] = useState<number>(0);
  const [tieneEnfermedad, setTieneEnfermedad] = useState<boolean>(false);
  const [tomaMedicamentos, setTomaMedicamentos] = useState<boolean>(false);
  const [momentoMedicacion, setMomentoMedicacion] = useState<string[]>([]);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] =
    useState<string>("");
  const [horasEspera, setHorasEspera] = useState<number>(1);
  const [showThinking, setShowThinking] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [resultado, setResultado] = useState<string>("");
  const [showQuestionSection, setShowQuestionSection] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mesesRecomando, setMesesRecomando] = useState<number[]>([]);

  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Comprobar inicialmente
    checkIfMobile();

    setTimeout(() => {
      setShowTooltip(true);
    }, 1500);

    // Comprobar cada vez que la ventana cambia de tamaño
    window.addEventListener("resize", checkIfMobile);

    // Limpiar el eventListener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Manejadores de eventos
  const toggleChat = () => {
    setChatVisible(!chatVisible);
    setShowTooltip(!showTooltip);
  };

  const closeChat = () => {
    setChatVisible(false);
  };

  const restartChat = () => {
    setStep(0);
    setRespuestas([]);
    setGotasCalculadas(0);
    setTieneEnfermedad(false);
    setTomaMedicamentos(false);
    setMomentoMedicacion([]);
    setDiagnosticoSeleccionado("");
    setHorasEspera(1);
    setShowResult(false);
    setShowQuestionSection(true);
  };

  const handleClickProduct = () => {
    setChatVisible(false);


    document
      ?.getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMultiSelect = () => {
    setStep(step + 1);
  };

  const handleOptionToggle = (option: string) => {
    setMomentoMedicacion((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const nextQuestion = (answer: string) => {
    const newResponses = [...respuestas, answer];
    setRespuestas(newResponses);

    if (
      step === 0 &&
      (answer === "Más información" || answer === "No, gracias")
    ) {
      showSpecialResult(answer);
      return;
    }

    // Lógica para calcular gotas
    if (step === 1) {
      // Respuesta de edad
      setGotasCalculadas((prev) => prev + (edadGotas[answer] || 0));
    } else if (step === 2) {
      // Respuesta de peso
      setGotasCalculadas((prev) => {
        const nuevasGotas = prev + (pesoGotas[answer] || 0);
        return Math.round(nuevasGotas / 2);
      });
    } else if (step === 3) {
      // ¿Tiene diagnóstico?
      const tieneDiagnostico = answer === "Sí";
      setTieneEnfermedad(tieneDiagnostico);
      if (!tieneDiagnostico) {
        setStep(5);
        return;
      }
    } else if (step === 4 && tieneEnfermedad) {
      // Tipo de diagnóstico
      setDiagnosticoSeleccionado(answer);
      const data = enfermedadData[answer] || { ajuste: 0, horas: 1, meses: [12] };
      setGotasCalculadas((prev) => prev + data.ajuste);
      setHorasEspera(data.horas);
      setMesesRecomando(data.meses);
    } else if (step === 5) {
      // ¿Toma medicamentos?
      const tomaMeds = answer === "Sí";
      setTomaMedicamentos(tomaMeds);

      // Si no toma medicamentos, saltar a última pregunta
      if (!tomaMeds) {
        setStep(7);
        return;
      }
    }

    setStep((prev) => prev + 1);

    if (step + 1 >= questions.length) {
      startThinking();
    }
  };

  const showSpecialResult = (answer: string) => {
    setShowQuestionSection(false);
    setShowResult(true);
    setResultado(resultInfo[answer]);
  };

  const startThinking = () => {
    setShowQuestionSection(false);
    setShowThinking(true);

    setTimeout(() => {
      generateResult();
    }, 1500);
  };

  const generateResult = () => {
    setShowThinking(false);
    setShowResult(true);

    let gotas = gotasCalculadas;
    // Asegurar que la dosis no sea negativa
    if (gotas < 0) {
      gotas = 0;
    }

    let instrucciones = "";

    if (gotas === 0) {
      instrucciones =
        "Basado en tus respuestas, no recomendamos el uso de microdosis de ayahuasca en este momento. Por favor consulta con un profesional de la salud.";
    } else {
      // Instrucciones básicas
      let instruccionesBasicas = `💊 Tu dosis recomendada es de ${gotas} gotas, dos veces al día.\n\n`;
      // Instrucciones para la mañana
      let instruccionesMañana = `💊 Por la mañana: Apenas te despiertas y en ayunas, antes de lavarte los dientes y antes de tomar agua, se echan ${gotas} gotas bajo la lengua; dejan que pase un minuto bajo la lengua y luego pasan lo que resta; luego de media hora ya te puedes lavar los dientes y tomar agua, luego de media hora más ya puedes tomar tu desayuno`;
      if (tomaMedicamentos && momentoMedicacion.includes("Mañana")) {
        instruccionesMañana += ` y después de una hora de la microdosis ya puedes tomar tus medicamentos.\n`;
      } else {
        instruccionesMañana += `.\n`;
      }

      // Instrucciones para la noche
      let instruccionesNoche = `\n💊 Por la noche: Tener en cuenta que tu última comida debe ser máximo a las 8 pm (luego de esa hora el estómago ya no hace digestión). `;
      if (tomaMedicamentos && momentoMedicacion.includes("Noche")) {
        instruccionesNoche += `Toma tus medicamentos inmediatamente después de la cena y después de hora y media tomas las ${gotas} gotas de microdosis de ayahuasca.\n`;
      } else {
        instruccionesNoche += `Después de hora y media de haber cenado, tomas las ${gotas} gotas de microdosis de ayahuasca.\n`;
      }

      // Añadir nota específica sobre medicamentos si seleccionó ambos momentos
      let notaMedicamentos = "";
      if (
        tomaMedicamentos &&
        momentoMedicacion.includes("Mañana") &&
        momentoMedicacion.includes("Noche")
      ) {
        notaMedicamentos = `\n⚠️ IMPORTANTE: Recuerda que el orden es diferente: en la mañana primero tomas la microdosis y DESPUÉS los medicamentos (1 hora después), mientras que en la noche primero tomas los medicamentos y DESPUÉS la microdosis (1.5 horas después).\n`;
      }

      // Instrucciones de calendario
      let instruccionesCalendario = `\n💊 Se toma dos días sí y uno no; por ejemplo, empiezas martes y miércoles y descansas de la medicina el jueves, vuelves a tomar viernes y sábado y descansas domingo.\n`;
      // Restricciones y cuidados
      let restricciones = `\n⚠️ Si tomas alcohol no tomar ayahuasca. Se deja ese día la medicina y se empieza al siguiente día como día uno.\n`;
      // Instrucciones específicas para el diagnóstico
      let instruccionesDiagnostico = "";
      if (tieneEnfermedad && diagnosticoSeleccionado) {
        instruccionesDiagnostico = `\n💊 Nota para tu diagnóstico de ${diagnosticoSeleccionado}: Se ha ajustado tu dosis considerando esta condición. Recuerda mantener un seguimiento de cómo te sientes durante el tratamiento.\n`;
      }

      // Instrucciones de conservación y dieta
      let conservacion = `\n🌿 Mantener la microdosis en un lugar fresco. El frasco abierto tiene vencimiento en 6 meses.\n`;
      let dieta = `\n🌿 Durante la toma de las microdosis hay que tener coherencia en la alimentación, evitar en lo máximo la carne de res y chancho, no café, no gaseosas, no comida chatarra, comidas bajas en azúcar y harinas.\n`;
      let mesesRecomendados = `\n😊 Recomendamos tomar la microdosis de ayahuasca entre ${mesesRecomando.length > 1 ? mesesRecomando.join(" a ") : mesesRecomando[0]} meses.\n`;
      instrucciones =
        instruccionesBasicas +
        instruccionesMañana +
        instruccionesNoche +
        notaMedicamentos +
        instruccionesCalendario +
        restricciones +
        instruccionesDiagnostico +
        conservacion +
        dieta +
        mesesRecomendados;
    }

    setResultado(instrucciones);
  };

  return (
    <>
      <button
        onClick={() => toggleChat()}
        className="chat-toggle"
        aria-label="Abrir asistente de microdosis"
      >
        {showTooltip && !isMobile && (
          <div className="tooltip-bubble">
            Simula tu microdosis de ayahuasca
            <div className="tooltip-arrow-down"></div>
          </div>
        )}
        <svg
          width={isMobile ? "70%" : "80%"}
          // height="85.044815mm"
          height="auto"
          viewBox="0 0 141.92133 85.044815"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(-31.008006,-6.8815468)">
            <g
              transform="translate(-1.7247387,-160.05575)"
              style={{ opacity: 1 }}
            >
              <path
                style={{
                  animation: "dropShadowPulse 2s infinite",
                  animationTimingFunction: "ease-in-out",
                  opacity: 1,
                  fill: "none",
                  fillOpacity: 1,
                  fillRule: "evenodd",
                  stroke: "white",
                  strokeWidth: 4.231,
                  strokeLinecap: "round",
                  strokeDasharray: "none",
                  strokeOpacity: 1,
                }}
                d="m 94.515679,242.22717 c 0,0 -30.700348,21.99443 -58.986062,-8.59158 0,0 23.111498,-28.52399 67.954703,0 0,0 -2.06968,-40.55221 -47.947734,-46.39452 0,0 -2.414634,16.49585 8.278745,28.18041"
              />
              <path
                style={{
                  animation: "dropShadowPulse 2s infinite",
                  animationTimingFunction: "ease-in-out",
                  opacity: 1,
                  fill: "none",
                  fillOpacity: 1,
                  fillRule: "evenodd",
                  stroke: "white",
                  strokeWidth: 4.231,
                  strokeLinecap: "round",
                  strokeDasharray: "none",
                  strokeOpacity: 1,
                }}
                d="m 89.686411,194.11439 c 0,0 1.724737,-14.7775 13.108009,-24.40009 0,0 31.73519,27.14938 1.37979,63.92129"
              />
              <path
                style={{
                  animation: "dropShadowPulse 2s infinite",
                  animationTimingFunction: "ease-in-out",
                  opacity: 1,
                  fill: "none",
                  fillOpacity: 1,
                  fillRule: "evenodd",
                  stroke: "white",
                  strokeWidth: 4.231,
                  strokeLinecap: "round",
                  strokeDasharray: "none",
                  strokeOpacity: 1,
                }}
                d="m 122.80139,196.52003 c 0,0 13.79791,-13.05922 27.94076,-11.34093 0,0 0.34496,47.08187 -46.56794,48.45649"
              />
              <path
                style={{
                  animation: "dropShadowPulse 2s infinite",
                  animationTimingFunction: "ease-in-out",
                  opacity: 1,
                  fill: "none",
                  fillOpacity: 1,
                  fillRule: "evenodd",
                  stroke: "white",
                  strokeWidth: 4.231,
                  strokeLinecap: "round",
                  strokeDasharray: "none",
                  strokeOpacity: 1,
                }}
                d="m 144.87804,219.20175 c 0,0 14.14286,-1.03097 26.90593,10.65356 0,0 -30.01045,38.49026 -67.9547,3.78028"
              />
            </g>
          </g>
        </svg>
      </button>

      {chatVisible && (
        <div
          className="chat-container chat-slide-in"
          style={{
            right: mobile ? "0" : "1.5rem",
            bottom: mobile ? "2rem" : "6.5rem",
            marginBottom: mobile ? "2rem" : "0",
          }}
        >
          <div className="chat-box">
            <button
              onClick={closeChat}
              className="close-button"
              aria-label="Cerrar chat"
            >
              ×
            </button>
            {showQuestionSection && (
              <>
                <div className="chat-message bot">
                  <p>{questions[step].text}</p>
                </div>
                <div className="options">
                  {questions[step].type === "multiselect" ? (
                    <>
                      <div className="multi-select">
                        {questions[step].options.map((option, index) => (
                          <div
                            key={index}
                            className={`checkbox-option ${momentoMedicacion.includes(option) ? "selected" : ""}`}
                            onClick={() => handleOptionToggle(option)}
                            data-value={option}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <button
                        className="continue-button"
                        onClick={handleMultiSelect}
                      >
                        Continuar
                      </button>
                    </>
                  ) : (
                    questions[step].options.map((option, index) => (
                      <button
                        key={index}
                        className="button"
                        onClick={() => nextQuestion(option)}
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}

            {showThinking && (
              <div className="thinking">
                <div className="loading-spinner"></div>
                <p>Analizando tus respuestas...</p>
              </div>
            )}

            {showResult && (
              <div className="result-container">
                <p className="result">{resultado}</p>
                <button onClick={restartChat} className="restart-button">
                  Realizar otra consulta
                </button>
                <button onClick={handleClickProduct} className="restart-button">
                 🛒 Comprar microdosis de ayahuasca
                </button>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default ChatBot;
