import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../../components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import PasswordRequirements from './PasswordRequirements';

function AuthCard({ title, description, action, children, footer, className = '' }) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>

      <CardContent>{children}</CardContent>

      {footer ? <CardFooter className="flex-col gap-2">{footer}</CardFooter> : null}
    </Card>
  );
}

export default AuthCard;
