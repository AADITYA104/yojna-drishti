"use client";

import React, { useState, useRef, useEffect } from "react";
import { localizeText } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
import {
  Headphones,
  X,
  Send,
  ChevronRight,
  Building2,
  Sparkles,
  Bot,
} from "lucide-react";

interface DrishtiAISahayakProps {
  gu: boolean;
  lang: AppLanguage;
  onNavigate: (page: string, searchTerm?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedAction?: { label: string; page: string; searchTerm?: string };
}

export function DrishtiAISahayak({ gu, lang, onNavigate }: DrishtiAISahayakProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "bot",
      text: gu
        ? "નમસ્તે! હું યોજના દૃષ્ટિ AI સહાયક છું. ગુજરાત સરકારની તમામ યોજનાઓ, પાત્રતા, આવક મર્યાદા અને અરજી પ્રક્રિયામાં હું આપને તાત્કાલિક માર્ગદર્શન આપી શકું છું. આપને કઈ યોજના વિશે માહિતી જોઈએ છે?"
        : lang === "hi"
          ? "नमस्ते! मैं योजना दृष्टि AI सहायक हूँ। गुजरात सरकार की सभी योजनाओं, पात्रता, आय सीमा और आवेदन प्रक्रिया में मैं आपकी सहायता कर सकता हूँ। आप किस योजना के बारे में जानना चाहते हैं?"
          : "Hello! I am Drishti AI Assistant. I can guide you through Gujarat government welfare schemes, eligibility rules, required documents, and application steps. How can I assist you today?",
      timestamp: gu ? "સહાયક ઓનલાઇન" : lang === "hi" ? "सहायक ऑनलाइन" : "Assistant Online",
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
    : lang === "hi"
      ? [
          "बालिकाओं के लिए योजनाएँ",
          "गंगा स्वरूपा विधवा सहायता",
          "आवश्यक दस्तावेज़ों की सूची",
          "आवेदन कहाँ जमा करें?",
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
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: gu ? "તમારો પ્રશ્ન" : lang === "hi" ? "आपका प्रश्न" : "You",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = "";
      let action: ChatMessage["suggestedAction"];

      if (lower.includes("દીકરી") || lower.includes("girl") || lower.includes("कन्या") || lower.includes("बालिका") || lower.includes("लड़की") || lower.includes("વાહલી")) {
        botResponse = gu
          ? "દીકરીઓ માટે ગુજરાત સરકારની 'વ્હાલી દીકરી યોજના' હેઠળ કુલ ₹૧,૧૦,૦૦૦ ની સહાય ત્રણ તબક્કે (ધોરણ ૧, ધોરણ ૯ અને ૧૮ વર્ષ પૂરા થયે) મળે છે. આ ઉપરાંત નમો લક્ષ્મી અને સરસ્વતી સાધના યોજનાઓ પણ સક્રિય છે."
          : lang === "hi"
            ? "बालिकाओं के लिए 'व्हाली दीकरी योजना' के तहत कुल ₹१,१०,००० की वित्तीय सहायता तीन किस्तों में (कक्षा १, कक्षा ९ और १८ वर्ष पूर्ण होने पर) दी जाती है। नमो लक्ष्मी योजना भी सक्रिय है।"
            : "For girl children, Gujarat's flagship 'Vahli Dikri Yojna' provides total assistance of ₹1,10,000 across 3 stages (Class 1, Class 9, and at age 18). Namo Lakshmi and Namo Saraswati schemes are also available.";
        action = {
          label: gu ? "વ્હાલી દીકરી યોજના જુઓ" : lang === "hi" ? "व्हाली दीकरी योजना देखें" : "View Vahli Dikri Yojna",
          page: "schemes",
          searchTerm: gu ? "વ્હાલી દીકરી" : "Vahli Dikri",
        };
      } else if (lower.includes("વિધવા") || lower.includes("गंगा") || lower.includes("विधवा") || lower.includes("widow")) {
        botResponse = gu
          ? "ગુજરાત સરકારની 'ગંગા સ્વરૂપા આર્થિક સહાય યોજના' હેઠળ નિરાધાર વિધવા બહેનોને દર મહિને ₹૧,૨૫૦ ની માસિક પેન્શન સહાય સીધી તેમના બેંક ખાતામાં DBT મારફતે જમા કરવામાં આવે છે."
          : lang === "hi"
            ? "'गंगा स्वरूपा आर्थिक सहायता योजना' के अंतर्गत निराधार विधवा बहनों को प्रतिमाह ₹१,२५० की पेंशन सीधे उनके बैंक खाते में DBT के माध्यम से दी जाती है।"
            : "Under the 'Ganga Swarupa Economic Assistance Scheme', eligible widowed women receive a monthly pension of ₹1,250 transferred directly to their bank account via DBT.";
        action = {
          label: gu ? "ગંગા સ્વરૂપા સહાય જુઓ" : lang === "hi" ? "गंगा स्वरूपा योजना देखें" : "View Ganga Swarupa Scheme",
          page: "schemes",
          searchTerm: gu ? "ગંગા સ્વરૂપા" : "Ganga Swarupa",
        };
      } else if (lower.includes("દસ્તાવેજ") || lower.includes("document") || lower.includes("પુરાવા") || lower.includes("दस्तावेज़") || lower.includes("दस्तावेज") || lower.includes("कागज़")) {
        botResponse = gu
          ? "મોટાભાગની સરકારી યોજનાઓ માટે મુખ્ય દસ્તાવેજો: ૧) આધાર કાર્ડ, ૨) રેશન કાર્ડ, ૩) આવકનો દાખલો (મામલતદાર/TDO), ૪) બેંક પાસબુક (IFSC કોડ સાથે), અને ૫) રહેઠાણનો પુરાવો (લાઈટબિલ/ચૂંટણી કાર્ડ) જરૂરી છે."
          : lang === "hi"
            ? "अधिकांश योजनाओं के लिए मुख्य दस्तावेज़: १) आधार कार्ड, २) राशन कार्ड, ३) आय प्रमाण पत्र (मामलतदार/TDO), ४) बैंक पासबुक (IFSC कोड सहित), और ५) निवास प्रमाण आवश्यक हैं।"
            : "Key documents needed for most welfare schemes: 1) Aadhaar Card, 2) Ration Card, 3) Income Certificate from Mamlatdar/TDO, 4) Bank Passbook with IFSC, and 5) Proof of Residence.";
        action = {
          label: gu ? "સ્માર્ટ પાત્રતા વિઝાર્ડ ખોલો" : lang === "hi" ? "स्मार्ट पात्रता विज़ार्ड खोलें" : "Open Eligibility Wizard",
          page: "wizard",
        };
      } else if (lower.includes("ક્યાં") || lower.includes("જમા") || lower.includes("અરજી") || lower.includes("form") || lower.includes("कहाँ") || lower.includes("जमा") || lower.includes("आवेदन") || lower.includes("फ़ॉर्म") || lower.includes("फॉर्म")) {
        botResponse = gu
          ? "આપ Digital Gujarat પોર્ટલ (digitalgujarat.gov.in) પર ઓનલાઇન અરજી કરી શકો છો, અથવા આપના ગામના e-Gram પંચાયત કેન્દ્ર (VCE), મામલતદાર કચેરી કે તાલુકા પંચાયત (TDO) કચેરીએ રૂબરૂ ફોર્મ જમા કરાવી શકો છો."
          : lang === "hi"
            ? "आप Digital Gujarat पोर्टल (digitalgujarat.gov.in) पर ऑनलाइन आवेदन कर सकते हैं, या अपने ग्राम पंचायत के e-Gram केंद्र (VCE), मामलतदार कार्यालय या तालुका पंचायत (TDO) में फ़ॉर्म जमा कर सकते हैं।"
            : "You can apply online at digitalgujarat.gov.in, or submit application forms in person at your village eGram center (VCE), Taluka Panchayat TDO office, or Mamlatdar office.";
        action = {
          label: gu ? "જિલ્લા અને કચેરીઓ જુઓ" : lang === "hi" ? "जिले और कार्यालय देखें" : "Explore District Offices",
          page: "map",
        };
      } else {
        botResponse = gu
          ? "યોજના દૃષ્ટિ પોર્ટલ પર ગુજરાત સરકારના તમામ વિભાગોની ૨૮૫+ કલ્યાણકારી યોજનાઓની માહિતી, પાત્રતા અને સહાય રકમ ઉપલબ્ધ છે. આપ કેટેગરી કે કીવર્ડ દ્વારા યોજના શોધી શકો છો."
          : lang === "hi"
            ? "योजना दृष्टि पोर्टल पर गुजरात सरकार के सभी विभागों की २८५+ कल्याणकारी योजनाओं की जानकारी, पात्रता और सहायता राशि उपलब्ध है। आप श्रेणी या खोज द्वारा योजना पा सकते हैं।"
            : "Yojana Drishti features 285+ welfare schemes across Gujarat government departments with complete eligibility rules, benefit amounts, and application assistance.";
        action = {
          label: gu ? "યોજના નિર્દેશિકા જુઓ" : lang === "hi" ? "योजना सूची देखें" : "Browse Schemes Directory",
          page: "schemes",
        };
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: botResponse,
        timestamp: gu ? "દૃષ્ટિ AI" : "Drishti AI",
        suggestedAction: action,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        className={`gov-helpdesk-floating-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={gu ? "યોજના ડિજિટલ સહાયક" : "Drishti Digital Assistant"}
      >
        {isOpen ? <X size={20} /> : <Headphones size={20} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="gov-helpdesk-floating-panel" role="dialog" aria-modal="true" aria-label="Drishti AI Assistant">
          <div className="ghp-head">
            <div className="ghp-brand">
              <div className="ghp-avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <strong>{gu ? "દૃષ્ટિ ડિજિટલ સહાયક" : lang === "hi" ? "दृष्टि डिजिटल सहायक" : "Drishti AI Assistant"}</strong>
                <small>{gu ? "ગુજરાત યોજના હેલ્પડેસ્ક · ૨૪/૭" : "Gujarat Scheme Helpdesk · 24/7"}</small>
              </div>
            </div>
            <button className="ghp-close-btn" onClick={() => setIsOpen(false)} aria-label={gu ? "બંધ કરો" : "Close"}>
              <X size={16} />
            </button>
          </div>

          <div className="ghp-body">
            {messages.map((m) => (
              <div key={m.id} className={`ghp-msg ${m.sender === "user" ? "user-msg" : "bot-msg"}`}>
                <div className="ghp-msg-text">{m.text}</div>
                <div className="ghp-msg-time">{m.timestamp}</div>
                {m.suggestedAction && (
                  <button
                    type="button"
                    className="ghp-action-chip"
                    onClick={() => {
                      onNavigate(m.suggestedAction!.page, m.suggestedAction!.searchTerm);
                      setIsOpen(false);
                    }}
                  >
                    <span>{m.suggestedAction.label}</span>
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ghp-quick-prompts">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="ghp-qp-btn"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            className="ghp-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder={gu ? "આપનો પ્રશ્ન અહીં લખો..." : lang === "hi" ? "अपना प्रश्न यहाँ लिखें..." : "Ask about any Gujarat scheme..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label={gu ? "સહાયકને પ્રશ્ન પૂછો" : "Ask assistant"}
            />
            <button type="submit" disabled={!inputText.trim()} aria-label={gu ? "મોકલો" : "Send"}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
