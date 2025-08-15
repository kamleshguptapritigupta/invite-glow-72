import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { currentLanguage, changeLanguage, languages, getCurrentLanguage } = useLanguageTranslation();

  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[200px] min-w-[150px]">
          <SelectValue placeholder="Select language">
            <div className="flex items-center gap-2">
              <span>{getCurrentLanguage.flag}</span>
              <span className="truncate">{getCurrentLanguage.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                 {lang.direction === 'rtl' && (
                  <span className="text-xs text-muted-foreground">(RTL)</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;