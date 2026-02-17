"use client";
import Image from "next/image";
import { RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import { useCakeBuilderStore } from "@/store/cakeBuilderStore";
import { customCakeAPI } from "@/lib/api";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

const MAX_GENERATIONS = 3;

export default function PreviewPanel() {
  const {
    specifications,
    previewImageUrl,
    isGenerating,
    generationCount,
    error,
    setPreviewImage,
    setIsGenerating,
    incrementGeneration,
    setPricing,
    setError,
  } = useCakeBuilderStore();

  const canGenerate = generationCount < MAX_GENERATIONS;

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await customCakeAPI.generatePreview(
        specifications as unknown as Record<string, unknown>
      );

      if (response.success && response.data) {
        setPreviewImage(response.data.imageUrl);
        setPricing(response.data.pricing as unknown as Parameters<typeof setPricing>[0]);
        incrementGeneration();
      } else {
        setError("Failed to generate preview. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate preview"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-brand border border-brand-sage/20 overflow-hidden">
      <div className="p-4 border-b border-brand-sage/20">
        <h3 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
          <Sparkles size={18} className="text-brand-red" />
          Cake Preview
        </h3>
        <p className="text-xs text-text-muted mt-1">
          See how your custom cake will look
        </p>
      </div>

      {/* Preview Area */}
      <div className="aspect-square bg-brand-cream/30 relative">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-brand-sage/30" />
              <div className="absolute inset-0 rounded-full border-4 border-brand-red border-t-transparent animate-spin" />
            </div>
            <p className="font-semibold text-text-primary">Our Chef is preparing the cake design for you</p>
            <p className="text-xs text-text-muted mt-1">
              Please wait a moment (5-15 seconds)
            </p>
          </div>
        ) : previewImageUrl ? (
          <Image
            src={previewImageUrl}
            alt="Cake preview"
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🎂</span>
            </div>
            <p className="font-semibold text-text-primary mb-1">
              Your cake preview will appear here
            </p>
            <p className="text-xs text-text-muted">
              Click &ldquo;Generate Preview&rdquo; to see a preview of your cake
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-brand text-sm">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          fullWidth
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : previewImageUrl ? (
            <>
              <RefreshCw size={16} className="mr-2" />
              Regenerate Preview
            </>
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Generate Preview
            </>
          )}
        </Button>

        <p className="text-xs text-text-muted text-center">
          {generationCount}/{MAX_GENERATIONS} generations used
        </p>

        {previewImageUrl && (
          <p className="text-xs text-text-muted text-center italic">
            This is a cake preview. The actual cake may vary slightly.
          </p>
        )}
      </div>
    </div>
  );
}
