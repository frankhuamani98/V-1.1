import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import SocialNav from '@/Components/SocialNav';

interface SocialNetwork {
  url: string;
  usuario: string;
  descripcion: string;
}

interface Props {
  redesData: {
    facebook: SocialNetwork;
    instagram: SocialNetwork;
    youtube: SocialNetwork;
    twitter: SocialNetwork;
    linkedin: SocialNetwork;
  };
}

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
};

const socialColors = {
  facebook: "hover:text-[#1877F2]",
  instagram: "hover:text-[#E4405F]",
  youtube: "hover:text-[#FF0000]",
  twitter: "hover:text-[#1DA1F2]",
  linkedin: "hover:text-[#0A66C2]",
};

export default function RedesSociales({ redesData }: Props) {
  return (
    <>
      <SocialNav />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Redes Sociales</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Object.entries(redesData).map(([network, data]) => {
            const IconComponent = socialIcons[network as keyof typeof socialIcons];
            const hoverColor = socialColors[network as keyof typeof socialColors];
            
            return (
              <Card key={network} className="group transition-transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className={`h-5 w-5 transition-colors ${hoverColor}`} />
                    <span className="capitalize">{network}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-lg font-medium block transition-colors ${hoverColor}`}
                    >
                      {data.usuario}
                    </a>
                    <p className="text-muted-foreground">{data.descripcion}</p>
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      Visitar perfil
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}