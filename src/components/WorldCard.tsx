
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from 'lucide-react';

interface WorldCardProps {
  id: string;
  name: string;
  createdAt: string;
}

const WorldCard = ({ id, name, createdAt }: WorldCardProps) => {
  // Format date to be more readable
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="bg-card hover:bg-card/80 transition-colors overflow-hidden group">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={14} className="mr-1" />
          <span>Created {formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/worlds/${id}`} className="w-full">
          <Button 
            variant="ghost" 
            className="w-full justify-between group-hover:bg-primary/10 transition-colors"
          >
            <span>Enter World</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default WorldCard;
