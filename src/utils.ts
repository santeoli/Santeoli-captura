/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, AppSettings } from "./types";

const LEADS_STORAGE_KEY = "santeoli_captured_leads";
const SETTINGS_STORAGE_KEY = "santeoli_app_settings";

export const DEFAULT_SETTINGS: AppSettings = {
  whatsappGroupUrl: "https://chat.whatsapp.com/invite/SanteoliVipGroup",
  giftName: "E-book Planejamento de Casamento dos Sonhos + R$ 500 em Crédito Santeoli",
  adminPassword: "agentejunto",
  whatsappGroupSpotsFilled: 92,
};

// Retrieve leads from local storage
export function getLeads(): Lead[] {
  try {
    const data = localStorage.getItem(LEADS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading leads from localStorage", error);
    return [];
  }
}

// Add a new lead
export function saveLead(name: string, whatsapp: string): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    whatsapp: whatsapp.replace(/\D/g, ""), // Save raw digits
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead); // Add to the top
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  return newLead;
}

// Delete a lead
export function deleteLead(id: string): Lead[] {
  const leads = getLeads();
  const filtered = leads.filter((lead) => lead.id !== id);
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

// Clear all leads
export function clearLeads(): void {
  localStorage.removeItem(LEADS_STORAGE_KEY);
}

// Retrieve settings
export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const merged = { ...DEFAULT_SETTINGS, ...parsed };
      if (merged.adminPassword === "123") {
        merged.adminPassword = "agentejunto";
        saveSettings(merged);
      }
      return merged;
    }
  } catch (error) {
    console.error("Error reading settings", error);
  }
  return DEFAULT_SETTINGS;
}

// Save settings
export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

// WhatsApp mask formatter
export function formatWhatsapp(value: string): string {
  // Extract only digits
  const digits = value.replace(/\D/g, "");
  
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : "";
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// Export captured leads to CSV
export function exportLeadsToCSV(leads: Lead[]): void {
  if (leads.length === 0) return;

  const headers = ["ID", "Nome", "WhatsApp", "Data de Cadastro"];
  const rows = leads.map((lead) => [
    lead.id,
    lead.name.replace(/"/g, '""'), // Escape quotes
    lead.whatsapp,
    new Date(lead.createdAt).toLocaleString("pt-BR"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((val) => `"${val}"`).join(",")),
  ].join("\n");

  // Create downloadable blob
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `leads_santeoli_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
