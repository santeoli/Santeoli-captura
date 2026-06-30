/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { 
  User, 
  MessageSquare, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  Settings,
  AlertCircle,
  ShieldCheck,
  Clock,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppSettings } from "./types";
import { getSettings, saveLead, formatWhatsapp } from "./utils";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [currentStep, setCurrentStep] = useState<"capture" | "redirect">("capture");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [refereeName, setRefereeName] = useState("");
  const [refereeWhatsapp, setRefereeWhatsapp] = useState("");
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  
  // Form submission and loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string; 
    whatsapp?: string;
    refereeName?: string;
    refereeWhatsapp?: string;
  }>({});
  
  // Settings state
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Update settings when dashboard triggers an update
  const handleSettingsChange = () => {
    setSettings(getSettings());
  };

  // Auto-format whatsapp as user types
  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value);
    setWhatsapp(formatted);
    if (errors.whatsapp) {
      setErrors((prev) => ({ ...prev, whatsapp: undefined }));
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleRefereeWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value);
    setRefereeWhatsapp(formatted);
    if (errors.refereeWhatsapp) {
      setErrors((prev) => ({ ...prev, refereeWhatsapp: undefined }));
    }
  };

  const handleRefereeNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRefereeName(e.target.value);
    if (errors.refereeName) {
      setErrors((prev) => ({ ...prev, refereeName: undefined }));
    }
  };

  // Validate step 1 and advance to step 2
  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; whatsapp?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Por favor, preencha o campo 'Seu nome'.";
    }
    
    const rawWhatsapp = whatsapp.replace(/\D/g, "");
    if (!rawWhatsapp) {
      newErrors.whatsapp = "Por favor, preencha o campo 'Whatsapp'.";
    } else if (rawWhatsapp.length < 10) {
      newErrors.whatsapp = "Por favor, insira um número de WhatsApp válido com o DDD.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormStep(2);
  };

  // Submit Lead from step 2
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validation for step 2
    const newErrors: { refereeName?: string; refereeWhatsapp?: string } = {};
    if (!refereeName.trim()) {
      newErrors.refereeName = "Por favor, preencha o campo 'Nome do indicado'.";
    }
    
    const rawRefereeWhatsapp = refereeWhatsapp.replace(/\D/g, "");
    if (!rawRefereeWhatsapp) {
      newErrors.refereeWhatsapp = "Por favor, preencha o campo 'Whatsapp do indicado'.";
    } else if (rawRefereeWhatsapp.length < 10) {
      newErrors.refereeWhatsapp = "Por favor, insira um número de WhatsApp válido com o DDD.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate database record and redirection
    setTimeout(() => {
      saveLead(`${name} (Indicador)`, whatsapp);
      saveLead(`${refereeName} (Indicado por ${name})`, refereeWhatsapp);
      
      setIsSubmitting(false);
      setCurrentStep("redirect");
    }, 1200);
  };

  const handleBackToCapture = () => {
    setName("");
    setWhatsapp("");
    setRefereeName("");
    setRefereeWhatsapp("");
    setFormStep(1);
    setCurrentStep("capture");
  };  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-stone-200 flex flex-col justify-between selection:bg-[#AE4E2D] selection:text-black relative overflow-hidden">
      
      {/* Deep Atmospheric Glow Overlays (Bold Typography Style) */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#4A2E25] rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2A344A] rounded-full blur-[110px]" />
      </div>

      <AnimatePresence mode="wait">
        {currentStep === "capture" ? (
          /* STEP 1: CAPTURE PAGE */
          <motion.div 
            key="capture-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-6 sm:px-12 items-center justify-center py-10 lg:py-16 z-10"
          >
            {/* Left Column: Branding, Copy & Bold Typography */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8 lg:py-6 text-center lg:text-left">
              
              {/* Header Branding */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center select-none">
                  <span className="font-serif text-4xl tracking-tight text-[#AE4E2D] lowercase flex items-center font-normal">
                    sante
                    <span className="inline-block transform scale-x-[-1] origin-center translate-y-[0.03em] mx-[0.01em]">c</span>
                    li
                  </span>
                </div>
                <p className="text-[9px] tracking-[0.4em] text-stone-400 font-semibold uppercase mt-1">
                  Fotografia de Famílias
                </p>
              </div>

              {/* Rich Narrative / Copy */}
              <div className="space-y-6">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-white font-light leading-[1.05] tracking-tighter">
                  Um presente especial de julho para quem fez parte da nossa <span className="italic font-serif text-[#AE4E2D]">história</span>.
                </h1>
                
                <h3 className="text-stone-300 font-serif italic text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
                  A Santeoli está mudando. Antes dessa nova fase, queremos presentear os clientes que caminharam com a gente desde o começo.
                </h3>

                <div className="space-y-4 text-stone-400 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  <p>
                    Desde o início, tivemos o privilégio de registrar o nascimento de famílias.
                  </p>
                  <p>
                    Agora, em julho, queremos abrir uma condição especial para clientes que nos indiquem um casal ou um ensaio.
                  </p>
                  <p className="text-white font-serif italic text-lg border-l-2 border-[#AE4E2D] pl-4 py-1 mt-2 bg-[#AE4E2D]/5 rounded-r">
                    Quem indicar e quem for indicado ganham <strong className="text-[#AE4E2D] font-sans font-bold not-italic">20% de desconto</strong>.
                  </p>
                </div>
              </div>

              {/* Secure Footer Badge */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] uppercase tracking-wider text-stone-500">
                <ShieldCheck className="w-4 h-4 text-[#AE4E2D]" />
                <span>Navegação Criptografada e Segura</span>
              </div>

            </div>

            {/* Right Column: Premium Form Card */}
            <div className="lg:col-span-5 w-full flex items-center justify-center">
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-800/10 text-stone-900 w-full max-w-md">
                <div className="mb-6 text-center border-b border-stone-100 pb-4">
                  <h2 className="text-stone-950 text-xl font-bold tracking-tight mb-1.5 flex items-center justify-center gap-2">
                    <Gift className="w-5 h-5 text-[#AE4E2D] shrink-0" />
                    <span>Indique e Ganhe um Presente</span>
                  </h2>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    Preencha os dados abaixo e ganhe 20% de desconto nos serviços de fotografia (Ensaios e Casamentos)
                  </p>
                </div>

                {/* Step Indicator Badge */}
                <div className="flex items-center justify-between mb-3 px-1 text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-[#AE4E2D]">
                    {formStep === 1 ? "Etapa 1: Sua Identificação" : "Etapa 2: Quem você indica"}
                  </span>
                  <span className="text-stone-400">
                    Etapa {formStep} de 2
                  </span>
                </div>
                {/* Tiny step progress bar */}
                <div className="w-full bg-stone-100 h-1.5 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-[#AE4E2D] h-full transition-all duration-300"
                    style={{ width: formStep === 1 ? "50%" : "100%" }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {formStep === 1 ? (
                    <motion.form 
                      key="step1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleNextStep} 
                      className="space-y-4"
                    >
                      {/* Input: Seu nome */}
                      <div className="space-y-1.5 text-left">
                        <label htmlFor="user-name" className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                          Seu nome
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input 
                            id="user-name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Como podemos te chamar?"
                            className={`w-full pl-10 pr-4 py-3.5 bg-stone-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                              errors.name 
                                ? "focus:ring-red-400 bg-red-50/30" 
                                : "focus:ring-[#AE4E2D] focus:bg-stone-50"
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Input: Whatsapp */}
                      <div className="space-y-1.5 text-left">
                        <label htmlFor="user-whatsapp" className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                          Whatsapp
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <input 
                            id="user-whatsapp"
                            type="tel"
                            value={whatsapp}
                            onChange={handleWhatsappChange}
                            placeholder="(00) 00000-0000"
                            className={`w-full pl-10 pr-4 py-3.5 bg-stone-50 border-none rounded-xl text-sm font-sans focus:outline-none focus:ring-2 transition-all ${
                              errors.whatsapp 
                                ? "focus:ring-red-400 bg-red-50/30" 
                                : "focus:ring-[#AE4E2D] focus:bg-stone-50"
                            }`}
                          />
                        </div>
                        {errors.whatsapp && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                            {errors.whatsapp}
                          </p>
                        )}
                      </div>

                      {/* Agreement Terms Checkbox */}
                      <div className="flex items-start gap-2.5 pt-1 text-left">
                        <input 
                          id="accept-terms"
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-1 accent-[#AE4E2D] rounded cursor-pointer h-4 w-4 shrink-0"
                        />
                        <label htmlFor="accept-terms" className="text-xs text-stone-500 cursor-pointer select-none leading-relaxed">
                          Aceito receber notificações exclusivas da Santeoli via WhatsApp. Seus dados estão protegidos.
                        </label>
                      </div>

                      {/* Button: Avançar */}
                      <button 
                        type="submit"
                        disabled={!acceptedTerms}
                        className="w-full bg-[#1A1A1A] hover:bg-[#AE4E2D] disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white py-4.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg mt-4 flex justify-center items-center gap-2 cursor-pointer"
                      >
                        Avançar para Indicação
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form 
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit} 
                      className="space-y-4"
                    >
                      {/* Input: Nome do indicado */}
                      <div className="space-y-1.5 text-left">
                        <label htmlFor="referee-name" className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                          Nome do indicado
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input 
                            id="referee-name"
                            type="text"
                            value={refereeName}
                            onChange={handleRefereeNameChange}
                            placeholder="Quem você gostaria de indicar?"
                            className={`w-full pl-10 pr-4 py-3.5 bg-stone-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                              errors.refereeName 
                                ? "focus:ring-red-400 bg-red-50/30" 
                                : "focus:ring-[#AE4E2D] focus:bg-stone-50"
                            }`}
                          />
                        </div>
                        {errors.refereeName && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                            {errors.refereeName}
                          </p>
                        )}
                      </div>

                      {/* Input: Whatsapp do indicado */}
                      <div className="space-y-1.5 text-left">
                        <label htmlFor="referee-whatsapp" className="block text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                          Whatsapp do indicado
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <input 
                            id="referee-whatsapp"
                            type="tel"
                            value={refereeWhatsapp}
                            onChange={handleRefereeWhatsappChange}
                            placeholder="(00) 00000-0000"
                            className={`w-full pl-10 pr-4 py-3.5 bg-stone-50 border-none rounded-xl text-sm font-sans focus:outline-none focus:ring-2 transition-all ${
                              errors.refereeWhatsapp 
                                ? "focus:ring-red-400 bg-red-50/30" 
                                : "focus:ring-[#AE4E2D] focus:bg-stone-50"
                            }`}
                          />
                        </div>
                        {errors.refereeWhatsapp && (
                          <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                            {errors.refereeWhatsapp}
                          </p>
                        )}
                      </div>

                      {/* Buttons: Voltar & Enviar */}
                      <div className="flex flex-col gap-2.5 pt-2">
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#1A1A1A] hover:bg-[#AE4E2D] disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white py-4.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg flex justify-center items-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processando...
                            </>
                          ) : (
                            <>
                              Quero acessar meu presente
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <button 
                          type="button"
                          onClick={() => setFormStep(1)}
                          disabled={isSubmitting}
                          className="w-full py-2 text-stone-400 hover:text-stone-800 transition-colors text-xs font-semibold uppercase tracking-widest cursor-pointer"
                        >
                          Voltar para etapa anterior
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <p className="text-[9px] text-[#AE4E2D] text-center mt-6 uppercase tracking-widest font-bold">
                  AO CLICAR, VOCÊ SERÁ REDIRECIONADO PARA O GRUPO EXCLUSIVO
                </p>
              </div>
            </div>

          </motion.div>
        ) : (
          /* STEP 2: REDIRECT / WHATSAPP GROUP PAGE (Luxury Midnight theme) */
          <motion.div 
            key="redirect-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 min-h-[90vh] relative z-10"
          >
            {/* Success Container Card (Beautiful luxury container matching the theme) */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#AE4E2D]/20 max-w-xl w-full text-center space-y-6 relative overflow-hidden text-stone-900">
              
              {/* Gold Ribbon crown */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#AE4E2D] via-[#4A2E25] to-[#AE4E2D]" />
              
              {/* Success Badge with custom gold color */}
              <div className="inline-flex justify-center items-center bg-[#AE4E2D]/10 text-[#AE4E2D] p-4 rounded-full mb-1">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-semibold tracking-tight">
                  Parabéns, {name.split(" ")[0]}!
                </h1>
                <p className="text-sm text-stone-500 font-medium">
                  Seu Voucher está disponível e pronto para uso.
                </p>
              </div>

              {/* Premium 20% OFF Voucher Card */}
              <div className="bg-[#AE4E2D]/5 border-2 border-dashed border-[#AE4E2D]/40 rounded-2xl p-6 text-stone-900 max-w-md mx-auto text-left relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-[#AE4E2D] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Ativo
                </div>
                <p className="text-xs font-bold text-[#AE4E2D] uppercase tracking-widest mb-2">20%OFF LIBERADO:</p>
                <p className="text-stone-950 font-serif text-sm sm:text-base leading-relaxed mb-3">
                  Você recebeu <strong>20%OFF nos serviços de fotografia da Santeoli</strong> (Ensaios ou Casamentos)
                </p>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Entre em contato para mais informações, ou entre agora no nosso Grupo VIP de Ofertas Santeoli no WhatsApp.
                </p>
                <div className="border-t border-[#AE4E2D]/20 pt-3 mt-4 flex items-center justify-between text-[10px] text-[#AE4E2D] font-bold uppercase tracking-wider">
                  <span>Validade:</span>
                  <span>Oferta válida por 1 ano.</span>
                </div>
              </div>

              {/* WhatsApp VIP Group CTA Card (FOMO Elements) */}
              <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-6 space-y-4 max-w-md mx-auto text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Grupo VIP Santeoli
                  </span>
                  <span className="text-stone-500 font-medium">Vagas quase esgotadas</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${settings.whatsappGroupSpotsFilled || 92}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>{settings.whatsappGroupSpotsFilled || 92}% das vagas preenchidas</span>
                    <span className="font-bold text-red-600 animate-pulse">Vagas Limitadas!</span>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <a 
                  href={settings.whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-bold tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-emerald-600/10 flex justify-center items-center gap-2 text-sm sm:text-base animate-bounce"
                >
                  <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
                  👉 Entrar no Grupo VIP Santeoli
                </a>
              </div>

              {/* Back to capture / Register again button */}
              <button 
                onClick={handleBackToCapture}
                className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors duration-200 hover:underline pt-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Não sou {name.split(" ")[0]}? Cadastrar outro número
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER & ADMIN PORTAL ACCESS */}
      <footer className="py-6 border-t border-stone-800/20 bg-stone-950/40 text-center text-xs text-stone-500 font-light flex flex-col sm:flex-row justify-between px-6 gap-3 shrink-0 z-10">
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <div className="h-[1px] w-6 bg-[#AE4E2D]" />
          <span>Santeoli Collection © 2026 · Todos os direitos reservados.</span>
        </div>
        <div className="flex justify-center gap-4 items-center">
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-stone-400 hover:text-[#AE4E2D] transition-colors flex items-center gap-1 font-semibold tracking-wider uppercase text-[10px] cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            Painel Santeoli
          </button>
        </div>
      </footer>

      {/* Admin Dashboard Modal */}
      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onSettingsChange={handleSettingsChange}
      />

    </div>
  );
}
