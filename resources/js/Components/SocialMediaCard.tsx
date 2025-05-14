import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface SocialMediaCardProps {
  title: string;
  username: string;
  description: string;
  profileUrl: string;
  icon: React.ReactNode;
  bgPattern: string;
  bgColor: string;
  buttonStyle: string;
  mediaUrl?: string;
  isVideo: boolean;
  customMedia?: React.ReactNode;
  useCustomMedia?: boolean;
}

export default function SocialMediaCard({
  title,
  username,
  description,
  profileUrl,
  icon,
  bgPattern,
  bgColor,
  buttonStyle,
  mediaUrl,
  isVideo,
  customMedia,
  useCustomMedia = false
}: SocialMediaCardProps) {
  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`${bgColor} p-2 rounded-lg`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{username}</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="relative"
        style={{
          backgroundImage: bgPattern,
          backgroundSize: '150px',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative space-y-4">
          <p className="text-gray-600 text-sm">{description}</p>
          
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            {useCustomMedia ? (
              customMedia
            ) : isVideo ? (
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={mediaUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={mediaUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex justify-center pt-2">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 ${buttonStyle} text-white text-sm px-4 py-2 rounded-md transition-transform hover:scale-105`}
            >
              Seguir
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
