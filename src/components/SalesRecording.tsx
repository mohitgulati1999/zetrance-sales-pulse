import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientButton } from '@/components/ui/gradient-button';
import { Mic, MicOff, Save, Phone } from 'lucide-react';
import { api } from '@/utils/api';
import { storage } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface SalesRecordingProps {
  onComplete?: () => void;
}

export function SalesRecording({ onComplete }: SalesRecordingProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Recording Error",
            description: "Speech recognition encountered an error. Please try again.",
            variant: "destructive",
          });
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [toast, isRecording]);

  const startRecording = () => {
    if (recognitionRef.current) {
      const timestamp = new Date().toISOString();
      setStartTimestamp(timestamp);
      setIsRecording(true);
      recognitionRef.current.start();
      toast({
        title: "Recording Started",
        description: "Start speaking to record the sales conversation.",
      });
    } else {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "You can now save the session or continue recording.",
      });
    }
  };

  const saveSession = async () => {
    if (!customerName || !customerNumber || !transcript || !startTimestamp) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and record some conversation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const user = storage.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "User not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const endTimestamp = new Date().toISOString();
      
      const sessionData = {
        userId: user.id,
        customerName,
        customerNumber,
        salespersonName: user.name,
        storeName: user.storeName || '',
        transcript,
        startTimestamp,
        endTimestamp,
      };

      const session = await api.createSalesSession(sessionData);
      await api.analyzeSession(session.id);
      
      toast({
        title: "Session Saved",
        description: "Sales session recorded and analyzed successfully!",
      });

      // Reset form
      setCustomerName('');
      setCustomerNumber('');
      setTranscript('');
      setStartTimestamp(null);
      
      onComplete?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-primary" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerNumber">Customer Number</Label>
            <Input
              id="customerNumber"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Enter customer phone number"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="mr-2 h-5 w-5 text-primary" />
            Voice Recording
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            {!isRecording ? (
              <GradientButton
                onClick={startRecording}
                size="lg"
                className="h-16 w-16 rounded-full"
              >
                <Mic className="h-8 w-8" />
              </GradientButton>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
                className="h-16 w-16 rounded-full"
              >
                <MicOff className="h-8 w-8" />
              </Button>
            )}
          </div>

          {isRecording && (
            <div className="text-center">
              <div className="animate-pulse text-sm text-muted-foreground">
                Recording in progress...
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Live Transcript</Label>
            <div className="min-h-32 p-3 border rounded-md bg-muted/30">
              {transcript || (
                <span className="text-muted-foreground italic">
                  Transcript will appear here as you speak...
                </span>
              )}
            </div>
          </div>

          <GradientButton
            onClick={saveSession}
            disabled={loading || !transcript}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving Session...' : 'Save Session'}
          </GradientButton>
        </CardContent>
      </Card>
    </div>
  );
}