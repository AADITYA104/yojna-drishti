"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Headphones,
  X,
  Send,
  ChevronRight,
  Building2,
  Info,
} from "lucide-react";

interface DrishtiAISahayakProps {
  gu: boolean;
  onNavigate: (page: string, searchTerm?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedAction?: { label: string; page: string; searchTerm?: string };
}

export function DrishtiAISahayak({ gu, onNavigate }: DrishtiAISahayakProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = useMemo<ChatMessage>(() => ({
    id: "welcome",
    sender: "bot",
    text: gu
      ? "નમસ્તે! હું આ યોજનાઓના પૂર્વદર્શન માટેનો સહાયક છું. અહીંની માહિતી નમૂનાની છે; પાત્રતા, લાભ અને અરજી પ્રક્રિયા સત્તાવાર વિભાગ પાસે ચકાસો."
      : "Hello! I can help you explore this scheme preview. Its entries are samples; confirm eligibility, benefits, and application steps with the responsible department.",
    timestamp: gu ? "નમૂનાનો જવાબ" : "Preview response",
  }), [gu]);

  const messages = useMemo(() => [welcomeMessage, ...chatHistory], [welcomeMessage, chatHistory]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickPrompts = gu
    ? [
        "દીકરીઓ માટેની યોજનાઓ",
        "ગંગા સ્વરૂપા વિધવા સહાય",
        "જિલ્લાવાર નકશો જુઓ",
        "નાણાકીય ચૂકવણી & DBT",
        "રિપોર્ટ CSV ડાઉનલોડ",
        "જરૂરી દસ્તાવેજોની યાદી",
      ]
    : [
        "Girl Child Schemes",
        "Ganga Swarupa Pension",
        "Explore Gujarat Map",
        "Financial & DBT Stats",
        "Download CSV Reports",
        "Required Documents",
      ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: gu ? "તમારો પ્રશ્ન" : "Your query",
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = "";
      let action: ChatMessage["suggestedAction"];

      if (lower.includes("દીકરી") || lower.includes("girl") || lower.includes("કન્યા") || lower.includes("વાહલી")) {
        botResponse = gu
          ? "યોજના સૂચિમાં દીકરીઓ માટેની કેટલીક નમૂનાની નોંધો છે. તેમની પાત્રતા, લાભની રકમ અને છેલ્લી તારીખ ચકાસેલી નથી. વિગતો જોવા યોજના સૂચિ ખોલો અને અરજી પહેલાં સત્તાવાર વિભાગ પાસે પુષ્ટિ કરો."
          : "The catalogue contains sample entries for girls. Their eligibility, benefit amounts, and deadlines are not verified. Open the scheme directory for the entries and confirm details with the official department before applying.";
        action = { label: gu ? "દીકરીની નોંધો શોધો" : "Find girl child entries", page: "schemes", searchTerm: gu ? "દીકરી" : "girl" };
      } else if (lower.includes("વિધવા") || lower.includes("ગંગા") || lower.includes("widow")) {
        botResponse = gu
          ? "સૂચિમાં વિધવા સહાય માટેની નમૂનાની નોંધ છે. તેમાંની રકમ અને શરતો સત્તાવાર રીતે ચકાસેલી નથી. પહેલા મૂળ વિભાગની વેબસાઇટ પર હાલના નિયમો તપાસો."
          : "The catalogue includes a sample widow-support entry. Its amount and conditions are not officially verified. Check the department’s current rules first.";
        action = { label: gu ? "વિધવા સહાયની નોંધ શોધો" : "Find widow support entry", page: "schemes", searchTerm: gu ? "વિધવા" : "widow" };
      } else if (lower.includes("નકશો") || lower.includes("map") || lower.includes("જિલ્લા") || lower.includes("તાલુકા") || lower.includes("ગામ") || lower.includes("district") || lower.includes("taluka") || lower.includes("village") || lower.includes("ઘોઘા") || lower.includes("ભાવનગર") || lower.includes("રાજકોટ") || lower.includes("અમદાવાદ")) {
        botResponse = gu
          ? "ગુજરાતના તમામ ૩૪ જિલ્લા, ૩૦૯ તાલુકા અને ૧૯,૨૦૦+ ગામોનું ભૌગોલિક મેપિંગ ઉપલબ્ધ છે. નકશામાં ક્લિક કરતાં જ હાઈલાઈટ થશે અને ગામવાર યોજના સ્તર જોઈ શકશો."
          : "Geographic mapping covers all 34 districts, 309 talukas, and 19,200+ villages of Gujarat. Click any district or village on the map to see localized coverage.";
        action = { label: gu ? "નકશો ખોલો" : "Open Gujarat Map", page: "map" };
      } else if (lower.includes("નાણા") || lower.includes("dbt") || lower.includes("બજેટ") || lower.includes("ચૂકવણી") || lower.includes("finance") || lower.includes("budget") || lower.includes("disbursed")) {
        botResponse = gu
          ? "નાણાકીય ઇન્ટેલિજન્સ સેક્શનમાં FY ૨૦૨૫–૨૬ હેઠળ ₹૪,૨૬૦ કરોડનું ફાળવણી અને DBT ચૂકવણી દર (૯૯.૨% સફળતા)નું વિશ્લેષણ જોઈ શકો છો."
          : "Under Financial Intelligence, track ₹4,260 Cr allocation for FY 2025–26 along with DBT distribution trends and 99.2% success rates.";
        action = { label: gu ? "નાણાકીય વિશ્લેષણ" : "Financial Analytics", page: "analytics" };
      } else if (lower.includes("સરખામણી") || lower.includes("તુલના") || lower.includes("compare") || lower.includes("vs")) {
        botResponse = gu
          ? "કોઈ પણ બે જિલ્લા વચ્ચે Side-by-Side સરખામણી કરી શકો છો: લાભાર્થી, મંજૂરી દર, ચૂકવણી અને ૫-વર્ષના ટ્રેન્ડ ચાર્ટ સાથે."
          : "Perform side-by-side comparison between any two Gujarat districts covering beneficiaries, approval rates, disbursements, and 5-year trends.";
        action = { label: gu ? "જિલ્લા સરખામણી" : "District Comparison", page: "analytics" };
      } else if (lower.includes("રિપોર્ટ") || lower.includes("ડાઉનલોડ") || lower.includes("csv") || lower.includes("pdf") || lower.includes("export") || lower.includes("report") || lower.includes("download")) {
        botResponse = gu
          ? "Reports Centerમાં જિલ્લા, તાલુકા, ગામો અને યોજનાઓની CSV ફાઇલ ડાઉનલોડ કરી શકો છો અથવા PDF પ્રિન્ટ કરી શકો છો."
          : "In the Reports Center, download comprehensive CSV datasets or print PDF summaries for districts, talukas, villages, and schemes.";
        action = { label: gu ? "રિપોર્ટ સેન્ટર ખોલો" : "Open Reports Center", page: "analytics" };
      } else if (lower.includes("સિસ્ટમ") || lower.includes("મોનિટરિંગ") || lower.includes("status") || lower.includes("health") || lower.includes("api") || lower.includes("admin") || lower.includes("rbac")) {
        botResponse = gu
          ? "એડમિન સેક્શનમાં ૪-સ્તરીય RBAC ગવર્નન્સ, સિસ્ટમ મોનિટરિંગ (API probes, લેટન્સી) અને CSV વેલિડેશન ટૂલ્સ ઉપલબ્ધ છે."
          : "The Administration module offers 4-tier RBAC governance, live system health monitoring (API probes, latency), and CSV validation tools.";
        action = { label: gu ? "વહીવટી ડેશબોર્ડ" : "Administration Hub", page: "settings" };
      } else if (lower.includes("દસ્તાવેજ") || lower.includes("document") || lower.includes("પુરાવા")) {
        botResponse = gu
          ? "દરેક યોજનાના દસ્તાવેજો અલગ હોઈ શકે છે. પૂર્વદર્શનની ચેકલિસ્ટ નમૂનાની છે—અરજી પહેલાં સત્તાવાર યોજના સૂચના સાથે એક-એક દસ્તાવેજ સરખાવો."
          : "Required documents vary by scheme. The preview checklist is illustrative; compare each document with the official scheme notice before applying.";
        action = { label: gu ? "પાત્રતા વિઝાર્ડ ખોલો" : "Open Eligibility Wizard", page: "public" };
      } else if (lower.includes("ક્યાં") || lower.includes("જમા") || lower.includes("અરજી") || lower.includes("form")) {
        botResponse = gu
          ? "અરજીનું સ્થળ યોજના અને વિભાગ પ્રમાણે બદલાય છે. આ પૂર્વદર્શનમાં સત્તાવાર અરજી લિંક જોડાયેલી નથી; સંબંધિત વિભાગનું અધિકૃત યોજના પાનું તપાસો."
          : "Application channels vary by scheme and department. This preview does not include official application links; check the responsible department’s scheme page.";
        action = { label: gu ? "નાગરિક પોર્ટલ" : "Citizen Portal", page: "public" };
      } else {
        botResponse = gu
          ? "આ પૂર્વદર્શનમાં મર્યાદિત નમૂનાની યોજના નોંધો છે; તે તમામ સરકારી યોજનાઓની સંપૂર્ણ યાદી નથી. સૂચિ ખોલીને ઉપલબ્ધ નોંધો શોધો."
          : "This preview contains a limited set of sample entries, not a complete government scheme register. Open the directory to search the available entries.";
        action = { label: gu ? "યોજના શોધક" : "Citizen Finder", page: "public" };
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: botResponse,
        timestamp: gu ? "નમૂનાનો જવાબ · ચકાસાયેલ નથી" : "Sample response · unverified",
        suggestedAction: action,
      };

      setChatHistory((prev) => [...prev, botMsg]);
    }, 450);
  };

  return (
    <>
      {/* Sample assistance preview */}
      <button
        type="button"
        className={`gov-helpdesk-floating-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={gu ? "યોજના માહિતી સહાયક · પૂર્વદર્શન" : "Scheme information helper · preview"}
        title={gu ? "પૂર્વદર્શન સહાયક" : "Preview helper"}
      >
        <span className="ghd-trigger-icon-wrap">
          {isOpen ? <X size={20} /> : <Headphones size={20} />}
        </span>
        <span className="ghd-trigger-text">
          {gu ? "પૂર્વદર્શન સહાયક" : "Preview helper"}
        </span>
      </button>

      {/* Preview assistant drawer */}
      {isOpen && (
        <div
          className="gov-helpdesk-popup-card"
          role="dialog"
          aria-modal="false"
          aria-label={gu ? "યોજના સહાયક સંવાદ" : "Scheme Assistant Chat"}
        >
          {/* Preview header */}
          <div className="ghd-card-header">
            <div className="ghd-header-title">
              <span className="ghd-emblem-badge">
                <Building2 size={18} />
              </span>
              <div>
                <strong>{gu ? "યોજના માહિતી સહાયક" : "Scheme information helper"}</strong>
                <small className="ghd-dept-line">
                  {gu ? "સત્તાવાર સરકારી સેવા નથી" : "Not an official government service"}
                </small>
              </div>
            </div>
            <button
              className="ghd-header-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={gu ? "બંધ કરો" : "Close"}
            >
              <X size={18} />
            </button>
          </div>

          <div className="ghd-emergency-strip">
            <Info size={14} aria-hidden="true" />
            <span>{gu ? "જવાબો નમૂનાના છે · સત્તાવાર માહિતી નથી" : "Sample answers · not official information"}</span>
          </div>

          {/* Messages Body */}
          <div className="ghd-card-body">
            {messages.map((m) => (
              <div key={m.id} className={`ghd-message-row ghd-message--${m.sender}`}>
                <div className="ghd-msg-bubble">
                  <p>{m.text}</p>
                  {m.suggestedAction && (
                    <button
                      className="ghd-action-btn"
                      onClick={() => {
                        onNavigate(m.suggestedAction?.page || "schemes", m.suggestedAction?.searchTerm);
                        setIsOpen(false);
                      }}
                    >
                      <span>{m.suggestedAction.label}</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                  <small className="ghd-msg-time">{m.timestamp}</small>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="ghd-quick-prompts-bar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="ghd-prompt-chip"
                onClick={() => handleSend(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            className="ghd-card-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={gu ? "યોજના અથવા સહાય નિયમો વિશે પૂછો..." : "Inquire about scheme rules or eligibility..."}
              aria-label={gu ? "પ્રશ્ન પૂછો" : "Inquire"}
            />
            <button
              type="submit"
              className="ghd-send-btn"
              disabled={!inputText.trim()}
              aria-label={gu ? "મોકલો" : "Send"}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
