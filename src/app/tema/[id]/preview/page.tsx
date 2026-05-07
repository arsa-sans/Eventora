import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { templates } from "@/data/templatesData";
import { getTheme } from "@/lib/themeRegistry";
import { getSampleData } from "@/lib/sampleData";
import { PreviewWrapper } from "@/components/preview/PreviewWrapper";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);
  if (!template) return { title: "Tema Tidak Ditemukan | Eventora" };

  return {
    title: `Preview Tema ${template.name} | Eventora`,
    description: `Lihat preview langsung tema undangan digital "${template.name}" — ${template.categoryLabel}. Mulai dari Rp ${(template.price / 1000).toFixed(0)}rb.`,
    openGraph: {
      title: `Tema ${template.name} — Eventora`,
      description: `Preview tema undangan digital ${template.name}.`,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export default async function TemplatePreviewPage({ params }: Props) {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);
  if (!template) notFound();

  const theme = getTheme(id);
  const sampleData = getSampleData(id);

  return (
    <PreviewWrapper
      templateId={id}
      templateName={template.name}
      templatePrice={template.price}
      templateCategory={template.categoryLabel}
      hasThemeComponent={!!theme}
      sampleData={sampleData}
    />
  );
}
