export const transcribeFromUrl = async () => {
    const apiKey = '1dbdfddd35d844ffa8b26c921b5d45e2';
    const audioFile = 'https://assembly.ai/wildfires.mp3'; // replace with your own later
  
    // Start transcription
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioFile,
      }),
    });
  
    const { id } = await transcriptRes.json();
  
    // Polling
    while (true) {
      const polling = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: { authorization: apiKey },
      });
  
      const data = await polling.json();
  
      if (data.status === 'completed') {
        console.log('✅ Transcribed:', data.text);
        return data.text;
      }
  
      if (data.status === 'error') {
        console.error('❌ Error:', data.error);
        throw new Error(data.error);
      }
  
      await new Promise(r => setTimeout(r, 2000));
    }
  };
  