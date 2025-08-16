import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Share2, FileImage, FileText, Copy, QrCode,CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';


interface ShareActionsProps {
  greetingData: any;
  greetingRef?: React.RefObject<HTMLDivElement>;
}

const ShareActions = ({ greetingData, greetingRef }: ShareActionsProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const tempDivRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageTranslation();
  const [isCopied, setIsCopied] = useState(false);


  const generateShareableURL = () => {
    const params = new URLSearchParams();
    Object.entries(greetingData).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        params.append(key, value);
      } else if (Array.isArray(value)) {
        params.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      }
    });
    return `${window.location.origin}/?${params.toString()}`;
  };

  const copyShareLink = () => {
    const shareableURL = generateShareableURL();
    navigator.clipboard.writeText(shareableURL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Link copied!",
      description: "Greeting link has been copied to your clipboard.",
    });
  };

  const shareToSocialMedia = (platform: string) => {
    const shareableURL = generateShareableURL();
    const text = "Check out this beautiful greeting I created!";
    
    let shareURL = '';
    switch (platform) {
      case 'whatsapp': shareURL = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareableURL)}`; break;
      case 'facebook': shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableURL)}`; break;
      case 'twitter': shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareableURL)}`; break;
      case 'telegram': shareURL = `https://t.me/share/url?url=${encodeURIComponent(shareableURL)}&text=${encodeURIComponent(text)}`; break;
      case 'linkedin': shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableURL)}`; break;
    }
    
    if (shareURL) window.open(shareURL, '_blank');
  };

    const shareGreeting = async () => {
    const shareableURL = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: 'Beautiful Greeting',
          text: 'Check out this beautiful greeting!',
          url: shareableURL
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareableURL);
        toast({
          title: "Link copied!",
          description: "Greeting URL copied to clipboard",
        });
      }
    } else {
      await navigator.clipboard.writeText(shareableURL);
      toast({
        title: "Link copied!",
        description: "Greeting URL copied to clipboard",
      });
    }
  };

  const ensureContentLoaded = async (element: HTMLElement) => {
    // Wait for fonts to load
    await document.fonts.ready;
    
    // Wait for images to load
    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Wait for videos to load
    const videos = element.querySelectorAll('video');
    await Promise.all(Array.from(videos).map(video => {
      if (video.readyState >= 3) return Promise.resolve();
      return new Promise((resolve) => {
        video.onloadeddata = resolve;
        video.onerror = resolve;
      });
    }));
  };


  const saveAsImage = async () => {
  if (!greetingRef?.current) {
    toast({
      title: "Error",
      description: "No greeting content to save.",
      variant: "destructive"
    });
    return;
  }

  setIsGenerating(true);
  
  try {
    // Create temporary container for reliable rendering
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = `${greetingRef.current.scrollWidth}px`;
    tempDiv.style.height = 'auto';
    tempDiv.appendChild(greetingRef.current.cloneNode(true));
    document.body.appendChild(tempDiv);

    // Wait for all assets to load
    await Promise.all([
      document.fonts.ready,
      ...Array.from(tempDiv.querySelectorAll('img')).map(img => 
        img.complete ? Promise.resolve() : new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        })
      ),
      ...Array.from(tempDiv.querySelectorAll('video')).map(video => 
        video.readyState >= 3 ? Promise.resolve() : new Promise(resolve => {
          video.onloadeddata = resolve;
          video.onerror = resolve;
        })
      )
    ]);

    const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: true,
      removeContainer: true
    });

    document.body.removeChild(tempDiv);

    const link = document.createElement('a');
    link.download = `greeting-${greetingData.eventType || 'card'}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Image saved!",
      description: "Your greeting has been saved as an image.",
    });
  } catch (error) {
    console.error('Error saving image:', error);
    toast({
      title: "Error",
      description: "Failed to save image. Please try again.",
      variant: "destructive"
    });
  } finally {
    setIsGenerating(false);
  }
};

const saveAsPDF = async () => {
  if (!greetingRef?.current) {
    toast({
      title: "Error",
      description: "No greeting content to save.",
      variant: "destructive"
    });
    return;
  }

  setIsGenerating(true);
  
  try {
    // First capture as image
    const canvas = await html2canvas(greetingRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: true
    });

    // Convert to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to maintain aspect ratio
    const ratio = Math.min(
      (pageWidth - 20) / canvas.width, 
      (pageHeight - 20) / canvas.height
    );
    
    const imgX = (pageWidth - canvas.width * ratio) / 2;
    const imgY = (pageHeight - canvas.height * ratio) / 2;

    pdf.addImage(imgData, 'PNG', imgX, imgY, 
      canvas.width * ratio, 
      canvas.height * ratio
    );
    
    pdf.save(`greeting-${greetingData.eventType || 'card'}-${Date.now()}.pdf`);

    toast({
      title: "PDF saved!",
      description: "Your greeting has been saved as a PDF.",
    });
  } catch (error) {
    console.error('Error saving PDF:', error);
    toast({
      title: "Error",
      description: "Failed to save PDF. Please try again.",
      variant: "destructive"
    });
  } finally {
    setIsGenerating(false);
  }
};

  const generateQRCode = () => {
    const shareableURL = generateShareableURL();
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareableURL)}`;
    
    const link = document.createElement('a');
    link.download = 'greeting-qr-code.png';
    link.href = qrCodeURL;
    link.click();
    
    toast({
      title: "QR Code generated!",
      description: "QR code for your greeting has been downloaded.",
    });
  };

  return (
    <>
    <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 no-capture">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg mb-2">Save & Share</h3>
          <p className="text-sm text-muted-foreground">
            {translate('Download your greeting or share it with others')}
           
          </p>
        </div>
      <div className="w-full flex flex-nowrap items-center justify-center gap-1 overflow-x-auto  ">

        <Button 
          onClick={saveAsImage} 
          disabled={isGenerating}
          className="shrink-0 flex items-center gap-1 px-3 md:px-4 bg-blue-600 hover:bg-blue-700"
        >
          <FileImage className="h-4 w-4" />
          <span className="hidden sm:inline whitespace-nowrap">Save Image</span>
        </Button>

        <Button 
          onClick={saveAsPDF} 
          disabled={isGenerating}
          className="shrink-0 flex items-center gap-1 px-3 md:px-4 bg-red-600 hover:bg-red-700"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline whitespace-nowrap">Save PDF</span>
        </Button>


 <Button onClick={copyShareLink} className="flex items-center gap-1 px-3 md:px-4 bg-green-600 hover:bg-green-700">
                {isCopied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
               <span className="hidden sm:inline whitespace-nowrap"> Copied! </span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline whitespace-nowrap">Copy Link</span>
              </>
            )}
              </Button>


                <Button 
          onClick={() => setShareDialogOpen(true)} 
          // onClick={shareGreeting}
          className="shrink-0 flex items-center gap-1 px-3 md:px-4"
        >
          <Share2 className="h-4 w-4" />
           <span className="hidden sm:inline whitespace-nowrap">Share</span>
          <span className="whitespace-nowrap">Link</span>
        </Button>

      </div>
 </CardContent>
    </Card>


      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Greeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Button onClick={copyShareLink} className="w-full justify-start" variant="outline">
                {isCopied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => shareToSocialMedia('whatsapp')} variant="outline" className="justify-start">
                📱 WhatsApp
              </Button>
              <Button onClick={() => shareToSocialMedia('facebook')} variant="outline" className="justify-start">
                📘 Facebook
              </Button>
              <Button onClick={() => shareToSocialMedia('twitter')} variant="outline" className="justify-start">
                🐦 Twitter
              </Button>
              <Button onClick={() => shareToSocialMedia('telegram')} variant="outline" className="justify-start">
                ✈️ Telegram
              </Button>
              <Button onClick={() => shareToSocialMedia('linkedin')} variant="outline" className="justify-start">
                💼 LinkedIn
              </Button>
              <Button onClick={generateQRCode} variant="outline" className="justify-start">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareActions;