import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Terminal } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) return <div className="text-center text-red-500">An error occurred: {error.message}</div>;

  const [hackerText, setHackerText] = useState('');

  useEffect(() => {
    const text = '> Accessing top secret hacker news...';
    let index = 0;
    const intervalId = setInterval(() => {
      setHackerText(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(intervalId);
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary flex items-center justify-center">
        <Terminal className="mr-2" />
        H4ck3r N3ws T0p 100
      </h1>
      <div className="max-w-3xl mx-auto mb-8">
        <div className="font-mono text-accent mb-4">{hackerText}</div>
        <Input
          type="text"
          placeholder="Initiate story search protocol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 bg-secondary text-secondary-foreground"
        />
      </div>
      <div className="grid gap-4 max-w-3xl mx-auto">
        {isLoading ? (
          Array(10).fill().map((_, index) => (
            <Card key={index} className="bg-card text-card-foreground border-accent">
              <CardHeader>
                <Skeleton className="h-4 w-3/4 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/4 bg-muted" />
              </CardContent>
            </Card>
          ))
        ) : (
          filteredStories.map(story => (
            <Card key={story.objectID} className="bg-card text-card-foreground border-accent">
              <CardHeader>
                <CardTitle className="text-lg font-mono">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono">Upvotes: {story.points}</p>
                <Button
                  variant="link"
                  asChild
                  className="p-0 h-auto font-normal text-primary"
                >
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
                    Decrypt Full Intel <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
