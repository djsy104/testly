function PasswordRequirements({ password }) {
  const rules = [{ label: 'At least 8 characters', ok: password.length >= 8 }];

  return (
    <ul className="mt-2 space-y-1 text-xs">
      {rules.map((rule) => (
        <li key={rule.label} className={rule.ok ? 'text-green-600' : 'text-muted-foreground'}>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}

export default PasswordRequirements;
