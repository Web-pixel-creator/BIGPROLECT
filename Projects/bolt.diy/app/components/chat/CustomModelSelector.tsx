import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';

// Only show these specific models
const CUSTOM_MODELS = [
  { name: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'Google' },
  { name: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'Google' },
  { name: 'deepseek/deepseek-chat', label: 'Deepseek V3', provider: 'OpenRouter' },
  { name: 'llama-3.3-70b-versatile', label: 'LLaMA 3.3 70B', provider: 'Groq' },
  { name: 'llama-3.1-8b-instant', label: 'LLaMA 3.1 8B', provider: 'Groq' },
];

interface CustomModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  className?: string;
}

export const CustomModelSelector: FC<CustomModelSelectorProps> = ({ selectedModel, onModelChange, className }) => {
  const currentLabel = CUSTOM_MODELS.find((m) => m.name === selectedModel)?.label || 'Gemini 2.5 Pro';

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className={`w-[160px] h-8 text-xs bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor ${className}`}>
        <SelectValue placeholder={currentLabel} />
      </SelectTrigger>
      <SelectContent>
        {CUSTOM_MODELS.map((model) => (
          <SelectItem key={model.name} value={model.name} className="text-xs cursor-pointer">
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
