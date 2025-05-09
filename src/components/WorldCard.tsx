
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Globe } from 'lucide-react';
import WorldCardActions from './WorldCardActions';

interface WorldCardProps {
  id: string;
  name: string;
  createdAt: string;
  onDelete?: () => void;
}

const WorldCard = ({ id, name, createdAt, onDelete = () => {} }: WorldCardProps) => {
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <Card className="bg-black/40 border border-gray-800 transition-all duration-200 hover:shadow-lg hover:border-blue-500/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <Link to={`/worlds/${id}`} className="inline-flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold hover:underline text-white">{name}</h3>
        </Link>
        <WorldCardActions id={id} name={name} onDelete={onDelete} />
      </CardHeader>
      <Link to={`/worlds/${id}`}>
        <CardContent className="px-4 py-3 text-sm text-gray-400">
          <p>Created {formattedDate}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default WorldCard;
