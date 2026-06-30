/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
}

export interface AppSettings {
  whatsappGroupUrl: string;
  giftName: string;
  adminPassword?: string;
  whatsappGroupSpotsFilled: number;
}
