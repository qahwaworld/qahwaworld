import React from "react";
import { Article } from "../types";
import { Calendar, User, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

interface ArticleCardProps {
  article: Article;
  locale: string;
  variant?: "default" | "small" | "featured" | "horizontal";
  onClick?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  locale,
  variant = "default",
  onClick,
}) => {

  // Map category names to badge color classes (light for normal cards, dark for featured overlay)
  const getBadgeClasses = (
    category?: string,
    tone: "light" | "dark" = "light"
  ) => {
    const key = (category || "").toLowerCase();
    const map: Record<string, { light: string; dark: string }> = {
      "coffee community": {
        light: "bg-emerald-200 text-emerald-800 hover:bg-emerald-300",
        dark: "bg-emerald-700 text-white hover:bg-emerald-800",
      },
      news: {
        light: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        dark: "bg-amber-700 text-white hover:bg-amber-800",
      },
      studies: {
        light: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        dark: "bg-gray-700 text-white hover:bg-gray-600",
      },
      interview: {
        light: "bg-orange-200 text-orange-800 hover:bg-orange-300",
        dark: "bg-orange-700 text-white hover:bg-orange-800",
      },
      "coffee reflections": {
        light: "bg-purple-200 text-purple-800 hover:bg-purple-300",
        dark: "bg-purple-700 text-white hover:bg-purple-800",
      },
    };

    return map[key]
      ? map[key][tone]
      : tone === "light"
      ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
      : "bg-amber-700 text-white hover:bg-amber-800";
  };

  if (variant === "small") {
    return (
      <div className="flex gap-3 cursor-pointer group" onClick={onClick}>
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Badge
            className={`${getBadgeClasses(
              article.category,
              "light"
            )} mb-1 text-xs`}
          >
            {article.category}
          </Badge>
          <h4 className="text-base group-hover:text-amber-700 transition-colors line-clamp-2 mb-1">
            {article.title}
          </h4>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className="cursor-pointer group" onClick={onClick}>
        <div className="relative overflow-hidden mb-4 h-96">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge
              className={`${getBadgeClasses(article.category, "dark")} mb-3`}
            >
              {article.category}
            </Badge>
            <h2 className="mb-2 text-white text-2xl group-hover:text-amber-300 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-200 line-clamp-2 mb-3">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        className="flex gap-4 cursor-pointer group border overflow-hidden hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <div className="w-48 h-32 flex-shrink-0 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0 p-4">
          <Badge
            className={`${getBadgeClasses(article.category, "light")} mb-2`}
          >
            {article.category}
          </Badge>
          <h3 className="mb-2 text-lg group-hover:text-amber-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="relative overflow-hidden mb-3 h-48">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <Badge className={`${getBadgeClasses(article.category, "light")} mb-2`}>
        {article.category}
      </Badge>
      <h3 className="mb-2 text-lg group-hover:text-amber-700 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {article.author}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {article.readTime}
        </span>
      </div>
    </div>
  );
};
