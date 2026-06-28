"use client";

import { useState } from "react";
import { Check, Star, ShoppingCart } from "lucide-react";

interface LicenseFeature {
  text: string;
  included: boolean;
}

interface LicenseTier {
  name: string;
  price: string;
  priceNote: string;
  color: string;
  glowColor: string;
  badge?: string;
  features: LicenseFeature[];
  beatstarsUrl: string;
}

export default function LicenseCard({ tier, index }: { tier: LicenseTier; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isPopular = !!tier.badge;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "20px",
        padding: "2px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered || isPopular ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered || isPopular
          ? `0 0 40px ${tier.glowColor}60, 0 20px 40px rgba(0,0,0,0.5)`
          : "0 8px 32px rgba(0,0,0,0.4)",
        animation: `fadeInUp 0.6s ${index * 0.1}s ease both`,
        opacity: 0,
      }}
    >
      {/* Animated gradient border */}
      <div
        className="gradient-border"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          background: `linear-gradient(135deg, ${tier.color}, ${tier.glowColor}, #EC4899, ${tier.color})`,
          backgroundSize: "300% 300%",
          animation: "gradientShift 3s linear infinite",
          opacity: hovered || isPopular ? 1 : 0.5,
          transition: "opacity 0.3s",
        }}
      />

      {/* Popular badge */}
      {tier.badge && (
        <div
          style={{
            position: "absolute",
            top: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            padding: "4px 16px",
            borderRadius: "50px",
            background: `linear-gradient(135deg, ${tier.color}, ${tier.glowColor})`,
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            boxShadow: `0 0 20px ${tier.glowColor}80`,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Star size={10} fill="#fff" />
          {tier.badge}
        </div>
      )}

      {/* Inner card */}
      <div
        style={{
          position: "relative",
          background: "#0D0D1A",
          borderRadius: "18px",
          padding: "28px 24px",
          zIndex: 1,
        }}
      >
        {/* Tier name */}
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "4px",
            color: tier.color,
            textTransform: "uppercase",
            marginBottom: "8px",
            textShadow: `0 0 10px ${tier.glowColor}`,
          }}
        >
          {tier.name}
        </div>

        {/* Price */}
        <div style={{ marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "42px",
              fontWeight: 900,
              color: "#F1F5F9",
              lineHeight: 1,
            }}
          >
            {tier.price}
          </span>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(241,245,249,0.4)",
            marginBottom: "24px",
            letterSpacing: "0.5px",
          }}
        >
          {tier.priceNote}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${tier.color}60, transparent)`,
            marginBottom: "20px",
          }}
        />

        {/* Features */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
          {tier.features.map((feat, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "13px",
                color: feat.included ? "#F1F5F9" : "rgba(241,245,249,0.3)",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: feat.included ? `${tier.color}25` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${feat.included ? tier.color : "rgba(255,255,255,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1px",
                }}
              >
                {feat.included && <Check size={10} color={tier.color} strokeWidth={3} />}
              </span>
              {feat.text}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href={tier.beatstarsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${tier.color}, ${tier.glowColor})`,
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.2s",
            boxShadow: `0 0 20px ${tier.glowColor}40`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 40px ${tier.glowColor}80`;
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 20px ${tier.glowColor}40`;
            (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          }}
        >
          <ShoppingCart size={14} />
          COMPRAR EN BEATSTARS
        </a>
      </div>
    </div>
  );
}
