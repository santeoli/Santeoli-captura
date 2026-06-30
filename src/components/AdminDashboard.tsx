/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  X, 
  Users, 
  Settings, 
  Download, 
  Trash2, 
  Lock, 
  MessageSquare, 
  CheckCircle, 
  Share2, 
  LogOut,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { Lead, AppSettings } from "../types";
import { 
  getLeads, 
  deleteLead, 
  clearLeads, 
  getSettings, 
  saveSettings, 
  exportLeadsToCSV 
} from "../utils";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: () => void;
}

export default function AdminDashboard({ isOpen, onClose, onSettingsChange }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  
  // Settings edit state
  const [groupUrl, setGroupUrl] = useState("");
  const [giftName, setGiftName] = useState("");
  const [spotsFilled, setSpotsFilled] = useState(92);
  const [newPassword, setNewPassword] = useState("");
  
  const [successMessage, setSuccessMessage] = useState("");

  // Load leads and settings when modal opens or state updates
  useEffect(() => {
    if (isOpen) {
      setLeads(getLeads());
      const loadedSettings = getSettings();
      setSettings(loadedSettings);
      setGroupUrl(loadedSettings.whatsappGroupUrl);
      setGiftName(loadedSettings.giftName);
      setSpotsFilled(loadedSettings.whatsappGroupSpotsFilled);
      setNewPassword(loadedSettings.adminPassword || "agentejunto");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSettings = getSettings();
    if (password === (currentSettings.adminPassword || "agentejunto")) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta. Tente novamente.");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      whatsappGroupUrl: groupUrl.trim() || "https://chat.whatsapp.com/invite/SanteoliVipGroup",
      giftName: giftName.trim() || "E-book Planejamento de Casamento + R$ 500 em Crédito Santeoli",
      adminPassword: newPassword.trim() || "123",
      whatsappGroupSpotsFilled: Math.min(100, Math.max(0, spotsFilled)),
    };
    saveSettings(updated);
    setSettings(updated);
    onSettingsChange();
    setSuccessMessage("Configurações salvas com sucesso!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este lead?")) {
      const updated = deleteLead(id);
      setLeads(updated);
    }
  };

  const handleClearAllLeads = () => {
    if (confirm("ATENÇÃO: Isso excluirá permanentemente TODOS os leads cadastrados. Continuar?")) {
      clearLeads();
      setLeads([]);
    }
  };

  const handleExport = () => {
    exportLeadsToCSV(leads);
  };

  const formatPhoneForLink = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    return clean.startsWith("55") ? clean : `55${clean}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-stone-50 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-stone-400" />
            <div>
              <h2 className="font-serif text-xl tracking-wider uppercase font-semibold">Painel Santeoli</h2>
              <p className="text-xs text-stone-400">Gerenciador de leads e configurações da campanha</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-800 rounded-full transition-colors duration-200 text-stone-400 hover:text-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Login Form */
          <div className="flex-1 flex items-center justify-center p-6 bg-stone-100">
            <div className="bg-white p-8 rounded-xl shadow-md border border-stone-200 max-w-sm w-full">
              <div className="flex justify-center mb-4">
                <div className="bg-stone-900 p-3 rounded-full text-stone-100">
                  <Lock className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-center font-serif text-lg text-stone-800 font-medium mb-2">Acesso Restrito</h3>
              <p className="text-xs text-stone-500 text-center mb-6">
                Digite a senha de administrador para gerenciar seus leads. (Padrão: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">123</code>)
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Senha de Acesso</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-stone-100 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow"
                >
                  Confirmar e Entrar
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Dashboard Content */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar for Navigation & Config */}
            <div className="w-full md:w-80 bg-stone-100 p-6 border-r border-stone-200 overflow-y-auto shrink-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-stone-800 font-semibold uppercase text-xs tracking-wider">Campanha VIP</h3>
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 transition-colors"
                    title="Sair do Painel"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair
                  </button>
                </div>

                {successMessage && (
                  <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Link do Grupo de WhatsApp
                    </label>
                    <input 
                      type="url" 
                      value={groupUrl} 
                      onChange={(e) => setGroupUrl(e.target.value)}
                      placeholder="https://chat.whatsapp.com/..."
                      className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                    />
                    <p className="text-[10px] text-stone-500 mt-0.5">Destino final do cliente após clicar no botão.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nome do Presente / Gancho
                    </label>
                    <textarea 
                      value={giftName} 
                      onChange={(e) => setGiftName(e.target.value)}
                      rows={3}
                      placeholder="Ex: E-book Planejamento..."
                      className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none resize-none"
                    />
                    <p className="text-[10px] text-stone-500 mt-0.5">Título do presente exibido na página de sucesso.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Vagas Preenchidas no Grupo (%)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        value={spotsFilled} 
                        onChange={(e) => setSpotsFilled(parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                        className="w-20 px-3 py-1.5 border border-stone-300 rounded bg-white text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                      />
                      <span className="text-xs text-stone-600">% preenchidas</span>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5">Define a barra de urgência e FOMO.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nova Senha do Painel
                    </label>
                    <input 
                      type="text" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-300 rounded bg-white text-xs focus:ring-1 focus:ring-stone-800 focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-800 text-stone-100 py-2 rounded text-xs font-semibold transition-all shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                </form>
              </div>

              <div className="border-t border-stone-200 pt-4 mt-6">
                <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                  <span>Atalhos: Leads salvos localmente.</span>
                </div>
              </div>
            </div>

            {/* Main Lead Viewer Grid */}
            <div className="flex-1 p-6 flex flex-col overflow-hidden bg-white">
              
              {/* Lead statistics summary banner */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-stone-900/10 p-2.5 rounded-lg text-stone-800">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Total de Leads</p>
                    <p className="text-2xl font-serif font-bold text-stone-800">{leads.length}</p>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-700">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Grupo de WhatsApp</p>
                    <p className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Ativo</p>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 bg-stone-900 text-stone-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Ações rápidas</p>
                    <p className="text-xs text-stone-300 mt-0.5">Exportar dados capturados</p>
                  </div>
                  <button 
                    onClick={handleExport}
                    disabled={leads.length === 0}
                    className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-950 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </button>
                </div>
              </div>

              {/* Lead Table Header Actions */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-serif text-lg text-stone-800 font-semibold flex items-center gap-2">
                  <span>Lista de Leads Recentes</span>
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{leads.length}</span>
                </h3>

                {leads.length > 0 && (
                  <button 
                    onClick={handleClearAllLeads}
                    className="text-stone-400 hover:text-red-600 transition-colors duration-200 flex items-center gap-1 text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Limpar Todos
                  </button>
                )}
              </div>

              {/* Table / List */}
              <div className="flex-1 overflow-y-auto border border-stone-200 rounded-xl">
                {leads.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center p-8 text-stone-400">
                    <Users className="w-12 h-12 stroke-1 mb-2 text-stone-300" />
                    <p className="text-sm font-semibold text-stone-600">Nenhum lead capturado ainda</p>
                    <p className="text-xs text-center text-stone-400 mt-1 max-w-xs">
                      Os dados inseridos no formulário principal serão salvos localmente e listados nesta tabela.
                    </p>
                  </div>
                ) : (
                  <div className="min-w-full inline-block align-middle">
                    <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                      <thead className="bg-stone-50 font-semibold text-stone-700 uppercase sticky top-0">
                        <tr>
                          <th className="px-4 py-3">Nome</th>
                          <th className="px-4 py-3">WhatsApp</th>
                          <th className="px-4 py-3">Data de Cadastro</th>
                          <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 bg-white">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="px-4 py-3 font-medium text-stone-900">{lead.name}</td>
                            <td className="px-4 py-3 font-sans text-stone-600">
                              {lead.whatsapp.length === 11 
                                ? `(${lead.whatsapp.slice(0, 2)}) ${lead.whatsapp.slice(2, 7)}-${lead.whatsapp.slice(7)}` 
                                : lead.whatsapp}
                            </td>
                            <td className="px-4 py-3 text-stone-500">
                              {new Date(lead.createdAt).toLocaleString("pt-BR")}
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              {/* Quick Chat Link */}
                              <a 
                                href={`https://wa.me/${formatPhoneForLink(lead.whatsapp)}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-1 rounded transition-colors text-[11px] font-semibold"
                                title="Iniciar conversa no WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                                Conversar
                              </a>
                              
                              {/* Delete Action */}
                              <button 
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded transition-colors inline-flex align-middle"
                                title="Excluir lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
