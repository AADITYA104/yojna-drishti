"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Menu,
  Search,
  ChevronDown,
  Languages,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { PageKey, navItems } from "./Sidebar";

export type GlobalSearchItem = {
  id: string;
  label: string;
  detail: string;
  kind: "district" | "taluka" | "village" | "scheme";
  districtId?: string;
  subdistrictCode?: number;
  villageCode?: string;
  aliases?: string[];
};

interface TopbarProps {
  currentPage: PageKey;
  gu: boolean;
  onToggleLanguage: () => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFy: string;
  onFyChange: (fy: string) => void;
  searchItems: GlobalSearchItem[];
  onSearchSelect: (item: GlobalSearchItem) => void;
}

export function Topbar({
  currentPage,
  gu,
  onToggleLanguage,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  searchInputRef,
  selectedFy,
  onFyChange,
  searchItems,
  onSearchSelect,
}: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [remoteResults, setRemoteResults] = useState<GlobalSearchItem[]>([]);
  const [remoteQuery, setRemoteQuery] = useState("");
  const currentNav = navItems.find((n) => n.key === currentPage);
  const pageTitle = currentNav ? (gu ? currentNav.gu : currentNav.en) : "";
  const localSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return [];
    return searchItems
      .filter((item) => `${item.label} ${item.detail} ${item.id} ${(item.aliases || []).join(" ")}`.toLocaleLowerCase().includes(query))
      .slice(0, 8);
  }, [searchItems, searchQuery]);
  const searchResults = remoteQuery === searchQuery.trim() && remoteResults.length
    ? remoteResults
    : localSearchResults;

  useEffect(() => {
    document.documentElement.lang = gu ? "gu" : "en";
  }, [gu]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/v1/search?q=${encodeURIComponent(query)}&lang=${gu ? "gu" : "en"}`, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error("Search service unavailable");
          return response.json();
        })
        .then((payload: { data?: GlobalSearchItem[] }) => {
          if (Array.isArray(payload.data) && !controller.signal.aborted) {
            setRemoteResults(payload.data);
            setRemoteQuery(query);
          }
        })
        .catch((error: Error) => {
          if (error.name !== "AbortError") setRemoteQuery("");
        });
    }, 160);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [gu, searchQuery]);

  const selectResult = (item: GlobalSearchItem) => {
    onSearchSelect(item);
    setSearchFocused(false);
  };

  return (
    <header className="topbar-gov">
      <div className="topbar-left">
        <button
          className="mobile-hamburger-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb-gov">
          <span className="brand-root-tag">Yojana Drishti</span>
          <span className="crumb-divider">/</span>
          <strong className="crumb-leaf">{pageTitle}</strong>
        </div>
      </div>

      {/* Global Search Input */}
      <div className="topbar-center global-search-wrap">
        <label className="global-search-gov">
          <Search size={16} className="search-icon" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchFocused(false);
                onSearchChange("");
              } else if (event.key === "Enter" && searchResults[0]) {
                event.preventDefault();
                selectResult(searchResults[0]);
              }
            }}
            aria-autocomplete="list"
            aria-controls="global-search-results"
            placeholder={
              gu
                ? "જિલ્લો, તાલુકો, ગામ અથવા યોજના શોધો..."
                : "Search a district, taluka, village, or scheme..."
            }
            aria-label="Search schemes or geography"
          />
          <kbd className="search-shortcut-key">Ctrl K</kbd>
        </label>
        {searchFocused && searchQuery.trim() && (
          <div className="global-search-results" id="global-search-results" role="listbox">
          {searchResults.length ? searchResults.map((item) => (
              <button
                key={`${item.kind}-${item.id}`}
                type="button"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectResult(item)}
              >
                <span className={`global-search-kind global-search-kind--${item.kind}`}>{item.kind}</span>
                <span className="global-search-result-copy"><b>{item.label}</b><small>{item.detail}</small></span>
                <ChevronRight size={15} />
              </button>
            )) : (
              <div className="global-search-empty" role="status">{gu ? "કોઈ મેળ ખાતું નામ મળ્યું નથી." : "No matching district, taluka, village, or scheme."}</div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="topbar-right">
        <span className="topbar-demo-badge" title={gu ? "આ પ્રોજેક્ટમાં preview data છે" : "This project currently uses preview data"}>
          <span aria-hidden="true" />{gu ? "ડેમો ડેટા" : "DEMO DATA"}
        </span>
        {/* Financial Year Selector */}
        <div className="fy-dropdown-wrap">
          <Calendar size={14} className="fy-icon" />
          <span className="fy-label">{gu ? "નાણાકીય વર્ષ:" : "FY:"}</span>
          <select
            value={selectedFy}
            onChange={(e) => onFyChange(e.target.value)}
            aria-label="Select Financial Year"
            className="fy-select"
          >
            <option value="2025–26">2025–26</option>
            <option value="2024–25">2024–25</option>
            <option value="2023–24">2023–24</option>
          </select>
          <ChevronDown size={13} className="dropdown-caret" />
        </div>

        {/* Language Toggle */}
        <button
          className="lang-toggle-btn"
          onClick={onToggleLanguage}
          aria-label={gu ? "Switch dashboard language to English" : "Switch dashboard language to Gujarati"}
          title={gu ? "Switch dashboard language to English" : "Switch dashboard language to Gujarati"}
        >
          <Languages size={15} />
          <span className="lang-text">{gu ? "ગુજરાતી" : "English"}</span>
          <span className="lang-alt-badge">{gu ? "EN" : "ગુજ"}</span>
        </button>
      </div>
    </header>
  );
}
