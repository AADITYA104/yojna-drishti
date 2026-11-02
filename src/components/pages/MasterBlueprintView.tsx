"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  Palette,
  Layers,
  Lock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserCheck,
  KeyRound,
  Terminal,
} from "lucide-react";

interface MasterBlueprintViewProps {
  gu: boolean;
}

export function MasterBlueprintView({ gu }: MasterBlueprintViewProps) {
  const [activeTab, setActiveTab] = useState<"prompt" | "tokens" | "animations" | "auth">("prompt");
  const [copied, setCopied] = useState(false);
  const [authRole, setAuthRole] = useState<"citizen" | "officer">("citizen");
  const [authStep, setAuthStep] = useState<"form" | "otp" | "success">("form");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const masterPromptContent = `You are an elite Lead Civic-Tech Frontend Architect and Design System Specialist working on the Government of Gujarat Scheme Geo-Intelligence Platform: "YOJANA DRISHTI" (યોજના દૃષ્ટિ - github.com/AADITYA104/yojna-drishti).

MISSION:
Transform and maintain the application in pure "Executive Civic-Tech" aesthetic (Stripe + Apple + DigiLocker grade precision):
1. ZERO funky or cartoonish visuals. Everything must look authoritative, official, and prestigious.
2. Authentic Government of Gujarat branding:
   - Primary Deep Emerald: #064e3b (Headers, primary actions, badges)
   - Secondary Forest: #047857
   - Saffron & Gold Accents: #d97706, #f59e0b (State emblem accents, highlights)
   - Surface: Frosted glass rgba(255, 255, 255, 0.82) with backdrop-filter: blur(16px)
   - Borders: 1px solid rgba(255, 255, 255, 0.6) and rgba(226, 232, 240, 0.8)
3. Full Gujarat Administrative Hierarchy:
   - State Level: 34 Districts with official RTO codes [GJ-01] to [GJ-39]
   - Subdistrict Level: 309 LGD Talukas with centroid GPS
   - Grassroots Level: 18,500+ Villages with Survey of India boundaries
4. Scheme Delivery Intelligence:
   - Live scheme reach KPIs per village (Schemes Delivered, Beneficiaries, Disbursed DBT ₹ Lakhs, Saturation %)
   - Interactive Document Checklist for citizen preparedness
5. Bilingual Support:
   - Perfect Gujarati (શ્રુતિ / Noto Sans Gujarati) alongside English toggle.
   - Compliance with DPDP Act 2023.`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(masterPromptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="blueprint-page-container">
      {/* Top Banner */}
      <div className="blueprint-hero">
        <div className="blueprint-hero-left">
          <span className="hero-kicker-tag" style={{ background: "rgba(217,119,6,0.15)", color: "#b45309" }}>
            <Sparkles size={14} />
            {gu ? "માસ્ટર બ્લુપ્રિન્ટ અને AI સ્ક્રિપ્ટ" : "MASTER BLUEPRINT & AI PROMPT SCRIPT"}
          </span>
          <h1>{gu ? "યોજના દૃષ્ટિ · એક્ઝિક્યુટિવ સિવિક-ટેક ડિઝાઇન બ્લુપ્રિન્ટ" : "Yojana Drishti · Executive Civic-Tech Design Blueprint"}</h1>
          <p>
            {gu
              ? "Stripe + DigiLocker + Apple જેવી સુઘડ અને અધિકૃત સરકારી ડિઝાઇન સિસ્ટમ, Framer Motion એનિમેશન સ્પેશિફિકેશન અને તમારા AI કોડિંગ એડિટર (Cursor / Windsurf / Claude) માટે કોપી-પેસ્ટ પ્રોમ્પ્ટ."
              : "Design tokens, Framer Motion animation specs, and one-click copyable Master AI Prompt for Cursor, Windsurf, Copilot, and Claude."}
          </p>
        </div>

        <div className="blueprint-hero-right">
          <button className="btn-copy-master-prompt" onClick={handleCopyPrompt}>
            {copied ? <Check size={18} className="text-emerald" /> : <Copy size={18} />}
            <span>{copied ? (gu ? "પ્રોમ્પ્ટ કોપી થઈ ગયો!" : "Prompt Copied!") : (gu ? "Copy Master Prompt" : "Copy Master Prompt")}</span>
          </button>
          <small className="blueprint-copy-hint">
            {gu ? "Cursor / Windsurf / VS Code માં પેસ્ટ કરવા માટે" : "Ready to paste in your AI Editor"}
          </small>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="blueprint-tabs-bar">
        <button
          className={`blueprint-tab-btn ${activeTab === "prompt" ? "is-active" : ""}`}
          onClick={() => setActiveTab("prompt")}
        >
          <Terminal size={16} />
          <span>{gu ? "૧. Master AI Prompt Script" : "1. Master AI Prompt Script"}</span>
        </button>
        <button
          className={`blueprint-tab-btn ${activeTab === "tokens" ? "is-active" : ""}`}
          onClick={() => setActiveTab("tokens")}
        >
          <Palette size={16} />
          <span>{gu ? "૨. Design Tokens & Palette" : "2. Design Tokens & Palette"}</span>
        </button>
        <button
          className={`blueprint-tab-btn ${activeTab === "animations" ? "is-active" : ""}`}
          onClick={() => setActiveTab("animations")}
        >
          <Layers size={16} />
          <span>{gu ? "૩. Animation & Motion Specs" : "3. Animation & Motion Specs"}</span>
        </button>
        <button
          className={`blueprint-tab-btn ${activeTab === "auth" ? "is-active" : ""}`}
          onClick={() => setActiveTab("auth")}
        >
          <Lock size={16} />
          <span>{gu ? "૪. Citizen & Officer Auth Portal" : "4. Citizen & Officer Auth Portal"}</span>
        </button>
      </div>

      {/* TAB 1: MASTER AI PROMPT SCRIPT */}
      {activeTab === "prompt" && (
        <div className="blueprint-tab-content">
          <div className="blueprint-code-wrapper">
            <div className="bcw-header">
              <span className="bcw-lang-tag">MASTER_PROMPT.md</span>
              <button className="bcw-copy-btn" onClick={handleCopyPrompt}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span>{copied ? (gu ? "કોપી થયું!" : "Copied!") : (gu ? "કોપી કરો" : "Copy")}</span>
              </button>
            </div>
            <pre className="bcw-pre">
              <code>{masterPromptContent}</code>
            </pre>
          </div>

          <div className="blueprint-instructions-card">
            <h3>{gu ? "આ પ્રોમ્પ્ટનો ઉપયોગ કેવી રીતે કરવો?" : "How to use this Master Prompt:"}</h3>
            <ol>
              <li>
                <b>{gu ? "પગલું ૧:" : "Step 1:"}</b> {gu ? "ઉપરના 'Copy Master Prompt' બટન પર ક્લિક કરીને આખો પ્રોમ્પ્ટ કોપી કરો." : "Click 'Copy Master Prompt' above to copy."}
              </li>
              <li>
                <b>{gu ? "પગલું ૨:" : "Step 2:"}</b> {gu ? "તમારા Cursor / Windsurf / VS Code Copilot અથવા Claude માં તમારો પ્રોજેક્ટ ઓપન કરો." : "Open your yojna-drishti project in Cursor / Windsurf / Copilot."}
              </li>
              <li>
                <b>{gu ? "પગલું ૩:" : "Step 3:"}</b> {gu ? "ચેટ બોક્સમાં આ પ્રોમ્પ્ટ પેસ્ટ કરો અને જે ફેરફાર કરવો હોય તે લખો. AI આપમેળે આ જ Executive Civic-Tech ડિઝાઇન ધોરણો જાળવી રાખશે." : "Paste this prompt into the agent chat to enforce this design standard."}
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 2: DESIGN TOKENS & PALETTE */}
      {activeTab === "tokens" && (
        <div className="blueprint-tab-content">
          <div className="tokens-grid">
            {/* Color Swatches */}
            <div className="token-card">
              <h3>{gu ? "ગુજરાત સરકાર અધિકૃત રંગછટા (Color Palette)" : "Official Color Palette"}</h3>
              <div className="swatches-list">
                <div className="swatch-item">
                  <span className="swatch-box" style={{ background: "#064e3b" }} />
                  <div>
                    <b>Primary Deep Emerald (#064e3b)</b>
                    <small>{gu ? "સત્તાવાર હેડર, નેવિગેશન અને મુખ્ય બેજ" : "Headers, navigation, primary branding"}</small>
                  </div>
                </div>
                <div className="swatch-item">
                  <span className="swatch-box" style={{ background: "#047857" }} />
                  <div>
                    <b>Forest Accent (#047857)</b>
                    <small>{gu ? "બટન ગ્રેડિયન્ટ્સ અને સક્રિય સ્ટેટ્સ" : "Button gradients & active states"}</small>
                  </div>
                </div>
                <div className="swatch-item">
                  <span className="swatch-box" style={{ background: "#d97706" }} />
                  <div>
                    <b>Saffron & Gold (#d97706)</b>
                    <small>{gu ? "સરકારી પ્રતીક, ખાસ હાઈલાઇટ્સ અને યોજના અર્જન્સી" : "State accents, urgent notices, KPIs"}</small>
                  </div>
                </div>
                <div className="swatch-item">
                  <span className="swatch-box" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid #cbd5e1" }} />
                  <div>
                    <b>Frosted Glass Surface</b>
                    <small>rgba(255, 255, 255, 0.82) · backdrop-filter: blur(16px)</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Tokens */}
            <div className="token-card">
              <h3>{gu ? "ફોન્ટ અને ટાઇપોગ્રાફી (Typography)" : "Typography Tokens"}</h3>
              <div className="typography-spec-box">
                <div className="typo-row">
                  <span>Display 1 (હેડલાઇન):</span>
                  <strong>૨૪-૩૨px · Bold ૮૦૦ · Noto Sans Gujarati</strong>
                </div>
                <div className="typo-row">
                  <span>Section Titles (ઉપશીર્ષક):</span>
                  <strong>૧૮-૨૨px · SemiBold ૭૦૦ · Inter / Gujarati</strong>
                </div>
                <div className="typo-row">
                  <span>Body Copy (વાંચન લખાણ):</span>
                  <strong>૧૩-૧૪px · Regular ૫૦૦ · Line Height ૧.૫૫</strong>
                </div>
                <div className="typo-row">
                  <span>Labels & Pills (ટેગ્સ):</span>
                  <strong>૧૧-૧૨px · Bold ૭૦૦ · Letter Spacing +0.03em</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANIMATIONS & MOTION */}
      {activeTab === "animations" && (
        <div className="blueprint-tab-content">
          <div className="token-card">
            <h3>{gu ? "Framer Motion અને CSS ટ્રાન્ઝિશન સ્પેક્સ" : "Motion & Animation Specs"}</h3>
            <div className="animation-specs-table">
              <div className="anim-row">
                <b>Micro Lift (Card Hover):</b>
                <code>transform: translateY(-2px); transition: 0.22s cubic-bezier(0.16, 1, 0.3, 1);</code>
              </div>
              <div className="anim-row">
                <b>Glass Dropdown / Modal Fade:</b>
                <code>opacity: 0 ➔ 1; transform: scale(0.98) ➔ scale(1); duration: 0.18s;</code>
              </div>
              <div className="anim-row">
                <b>Progress Bar Fill:</b>
                <code>transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);</code>
              </div>
              <div className="anim-row">
                <b>Map Hover Tooltip:</b>
                <code>transition: transform 0.08s ease-out, opacity 0.12s ease-out;</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CITIZEN & OFFICER AUTH PORTAL */}
      {activeTab === "auth" && (
        <div className="blueprint-tab-content">
          <div className="auth-demo-card">
            <div className="auth-role-switch">
              <button
                className={`auth-role-btn ${authRole === "citizen" ? "active" : ""}`}
                onClick={() => {
                  setAuthRole("citizen");
                  setAuthStep("form");
                }}
              >
                <UserCheck size={16} />
                <span>{gu ? "નાગરિક પ્રવેશ (Citizen Login)" : "Citizen Access"}</span>
              </button>
              <button
                className={`auth-role-btn ${authRole === "officer" ? "active" : ""}`}
                onClick={() => {
                  setAuthRole("officer");
                  setAuthStep("form");
                }}
              >
                <KeyRound size={16} />
                <span>{gu ? "અધિકારી પ્રવેશ (Govt Officer SSO)" : "Officer SSO"}</span>
              </button>
            </div>

            {authStep === "form" && (
              <div className="auth-form-wrap">
                <h3>
                  {authRole === "citizen"
                    ? gu ? "મોબાઇલ નંબર અથવા મેરી પહેચાનથી પ્રવેશ કરો" : "Enter Mobile Number or MeriPehchaan"
                    : gu ? "ગુજરાત સરકાર ઈ-ઓફિસ ઓળખપત્ર" : "Gujarat Govt e-Office Credentials"}
                </h3>
                <label className="auth-input-group">
                  <span>{authRole === "citizen" ? (gu ? "મોબાઇલ નંબર (OTP માટે):" : "Mobile Number:") : (gu ? "કર્મચારી ID / સત્તાવાર ઈમેઈલ:" : "Employee ID / Email:")}</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={authRole === "citizen" ? "9876543210" : "officer@gujarat.gov.in"}
                  />
                </label>

                <button
                  className="btn-auth-submit"
                  onClick={() => setAuthStep("otp")}
                  disabled={!phone.trim()}
                >
                  {gu ? "ઓટીપી (OTP) મોકલો" : "Generate Secure OTP"}
                </button>

                <div className="digilocker-badge-row">
                  <ShieldCheck size={16} className="text-emerald" />
                  <span>{gu ? "DigiLocker & MeriPehchaan સુરક્ષિત પ્રમાણીકરણ" : "DigiLocker & MeriPehchaan SSO Enabled"}</span>
                </div>
              </div>
            )}

            {authStep === "otp" && (
              <div className="auth-form-wrap">
                <h3>{gu ? "ઓટીપી (OTP) દાખલ કરો" : "Enter 6-Digit OTP"}</h3>
                <p style={{ fontSize: "12px", color: "#64748b" }}>
                  {gu ? `નંબર ${phone} પર ૬ અંકનો કોડ મોકલેલ છે (ડેમો કોડ: 123456)` : `Code sent to ${phone} (Demo code: 123456)`}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="auth-otp-input"
                />
                <button
                  className="btn-auth-submit"
                  onClick={() => setAuthStep("success")}
                >
                  {gu ? "ચકાસો અને આગળ વધો" : "Verify & Proceed"}
                </button>
              </div>
            )}

            {authStep === "success" && (
              <div className="auth-success-wrap">
                <CheckCircle2 size={40} className="text-emerald" />
                <h3>{gu ? "સફળતાપૂર્વક પ્રમાણિત!" : "Successfully Verified!"}</h3>
                <p>
                  {authRole === "citizen"
                    ? gu ? "તમારું નાગરિક એકાઉન્ટ સક્રિય છે. તમે યોજનાઓમાં સીધી અરજી કરી શકો છો." : "Citizen account verified. You can now apply for welfare schemes."
                    : gu ? "અધિકારી એકાઉન્ટ સક્રિય છે. તમારી પાસે જિલ્લા/તાલુકા મોનિટરિંગ એક્સેસ છે." : "Officer account verified with district monitoring privileges."}
                </p>
                <button
                  className="btn-primary-gov"
                  onClick={() => setAuthStep("form")}
                >
                  {gu ? "નવું સેશન શરૂ કરો" : "Start New Session"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
