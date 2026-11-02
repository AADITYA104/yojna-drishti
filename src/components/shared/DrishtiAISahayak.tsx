"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Headphones,
  X,
  Send,
  User,
  ChevronRight,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileText,
  HelpCircle,
} from "lucide-react";

interface DrishtiAISahayakProps {
  gu: boolean;
  onNavigate: (page: any) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedAction?: { label: string; page: string };
}

export function DrishtiAISahayak({ gu, onNavigate }: DrishtiAISahayakProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "bot",
      text: gu
        ? "નમસ્તે! મહિલા અને બાળ વિકાસ વિભાગ નાગરિક સહાયતા કેન્દ્રમાં આપનું સ્વાગત છે. ગુજરાત સરકારની કલ્યાણકારી યોજનાઓ, પાત્રતા, આવક મર્યાદા અને જરૂરી દસ્તાવેજો અંગે કોઈ પણ પ્રશ્ન પૂછી શકો છો."
        : "Welcome to the Department of Women & Child Development Citizen Assistance Desk. Inquire about Gujarat welfare schemes, eligibility rules, and required documentation.",
      timestamp: "સત્તાવાર માર્ગદર્શન",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickPrompts = gu
    ? [
        "દીકરીઓ માટેની યોજનાઓ",
        "ગંગા સ્વરૂપા વિધવા સહાય",
        "જરૂરી દસ્તાવેજોની યાદી",
        "અરજી ક્યાં જમા કરાવવી?",
      ]
    : [
        "Girl Child Schemes",
        "Ganga Swarupa Pension",
        "Required Documents",
        "Where to submit form?",
      ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
      timestamp: "તમારો પ્રશ્ન",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = "";
      let action: { label: string; page: string } | undefined;

      if (lower.includes("દીકરી") || lower.includes("girl") || lower.includes("કન્યા") || lower.includes("વાહલી")) {
        botResponse = gu
          ? "વહાલી દીકરી યોજના (VDY): દીકરીના જન્મ સમયે નોંધણી બાદ ધોરણ ૧ માં ₹૪,૦૦૦, ધોરણ ૯ માં ₹૬,૦૦૦ અને ૧૮ વર્ષ પૂર્ણ થતાં ઉચ્ચ શિક્ષણ કે લગ્ન માટે ₹૧,૦૦,૦૦૦ મળી કુલ ₹૧,૧૦,૦૦૦ ની સહાય સીધા બેંક ખાતામાં DBT દ્વારા મળે છે. ગ્રામ્ય વિસ્તારમાં સ્થાનિક આંગણવાડી અથવા તાલુકા પંચાયત (WCD શાખા) માં અરજી કરી શકાય છે."
          : "Vahali Dikri Yojana: Provides total assistance of ₹1,10,000 across 3 milestones (Class 1: ₹4,000, Class 9: ₹6,000, and age 18: ₹1,00,000). Applications accepted at Anganwadis or Taluka WCD offices.";
        action = { label: gu ? "યોજનાઓની યાદી જુઓ" : "View Schemes", page: "schemes" };
      } else if (lower.includes("વિધવા") || lower.includes("ગંગા") || lower.includes("widow")) {
        botResponse = gu
          ? "ગંગા સ્વરૂપા આર્થિક સહાય યોજના: ૧૮ કે તેથી વધુ વયની નિરાધાર/વિધવા બહેનોને દર મહિને ₹૧,૨૫૦ (વાર્ષિક ₹૧૫,૦૦૦) પોસ્ટ કે બેંક ખાતામાં સીધા જમા કરવામાં આવે છે. આ સહાય પુનઃલગ્ન ન થાય ત્યાં સુધી આજીવન મળે છે."
          : "Ganga Swarupa Scheme: Monthly pension of ₹1,250 (₹15,000/year) disbursed directly to bank/post office accounts for widowed beneficiaries.";
        action = { label: gu ? "પાત્રતા ચકાસો" : "Check Eligibility", page: "public" };
      } else if (lower.includes("દસ્તાવેજ") || lower.includes("document") || lower.includes("પુરાવા")) {
        botResponse = gu
          ? "સામાન્ય રીતે જરૂરી મુખ્ય પુરાવા: ૧. આધાર કાર્ડ, ૨. રેશન કાર્ડ, ૩. આવકનો દાખલો (મામલતદાર/તલાટીનો), ૪. બેંક પાસબુક પ્રથમ પાનાની નકલ, ૫. ઉંમરનો પુરાવો (શાળા છોડ્યાનું પ્રમાણપત્ર અથવા જન્મ પ્રમાણપત્ર)."
          : "Mandatory documents: 1. Aadhaar Card, 2. Ration Card, 3. Income Certificate from Talati/Mamlatdar, 4. Bank Passbook copy, 5. Proof of age.";
        action = { label: gu ? "પાત્રતા વિઝાર્ડ ખોલો" : "Open Eligibility Wizard", page: "public" };
      } else if (lower.includes("ક્યાં") || lower.includes("જમા") || lower.includes("અરજી") || lower.includes("form")) {
        botResponse = gu
          ? "અરજી જમા કરાવવાના સ્થળો: ૧. તમારા ગામની સ્થાનિક આંગણવાડી કાર્યકર, ૨. ગ્રામ પંચાયતના ઈ-ગ્રામ કેન્દ્ર / તલાટી-કમ-મંત્રી, ૩. તાલુકા પંચાયતની બાળ વિકાસ યોજના અધિકારી (CDPO) કચેરી, અથવા ડિજિટલ સેવા સેતુ પોર્ટલ."
          : "Application venues: 1. Village Anganwadi Worker, 2. e-Gram Kendra / Talati, 3. Taluka CDPO office, or Digital Seva Setu portal.";
        action = { label: gu ? "નાગરિક પોર્ટલ" : "Citizen Portal", page: "public" };
      } else {
        botResponse = gu
          ? "મહિલા અને બાળ વિકાસ વિભાગની તમામ યોજનાઓનું વિશ્લેષણ અને પાત્રતા માપદંડ 'યોજના શોધક' ટેબમાં ઉપલબ્ધ છે. વધુ માહિતી માટે હેલ્પલાઇન ૧૮૧ (અભયમ) પર સંપર્ક કરી શકો છો."
          : "All departmental schemes and eligibility criteria are indexed in the Citizen Finder tab. For urgent support, dial 181 (Abhayam).";
        action = { label: gu ? "યોજના શોધક" : "Citizen Finder", page: "public" };
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: botResponse,
        timestamp: "અધિકૃત ઉત્તર",
        suggestedAction: action,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  return (
    <>
      {/* Official Floating Trigger Button */}
      <button
        type="button"
        className={`gov-helpdesk-floating-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={gu ? "સરકારી સહાયતા ડેસ્ક" : "Citizen Assistance Desk"}
        title={gu ? "નાગરિક સહાયતા કેન્દ્ર" : "Citizen Helpdesk"}
      >
        <span className="ghd-trigger-icon-wrap">
          {isOpen ? <X size={20} /> : <Headphones size={20} />}
        </span>
        <span className="ghd-trigger-text">
          {gu ? "નાગરિક સહાયતા (181 / 1098)" : "Citizen Helpdesk (181)"}
        </span>
      </button>

      {/* Official Helpdesk Drawer Card */}
      {isOpen && (
        <div className="gov-helpdesk-popup-card" role="dialog" aria-modal="false">
          {/* Official Header */}
          <div className="ghd-card-header">
            <div className="ghd-header-title">
              <span className="ghd-emblem-badge">
                <Building2 size={18} />
              </span>
              <div>
                <strong>{gu ? "મહિલા & બાળ કલ્યાણ સહાયતા કેન્દ્ર" : "WCD Citizen Helpdesk"}</strong>
                <small className="ghd-dept-line">
                  {gu ? "ગુજરાત સરકાર · ગાંધીનગર" : "Government of Gujarat · Gandhinagar"}
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

          {/* Official Toll-Free Helpline Strip */}
          <div className="ghd-emergency-strip">
            <div className="ghd-helpline-chip">
              <PhoneCall size={13} className="text-emerald" />
              <span>{gu ? "૧૮૧ અભયમ મહિલા હેલ્પલાઇન" : "181 Abhayam Women Helpline"}</span>
            </div>
            <div className="ghd-helpline-chip">
              <PhoneCall size={13} className="text-amber" />
              <span>{gu ? "૧૦૯૮ ચાઇલ્ડલાઇન" : "1098 Childline"}</span>
            </div>
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
                        onNavigate(m.suggestedAction?.page);
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
