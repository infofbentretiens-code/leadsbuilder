BEGIN;
ALTER TABLE public.interactions DROP CONSTRAINT IF EXISTS interactions_type_check;
ALTER TABLE public.interactions ADD CONSTRAINT interactions_type_check CHECK (type IN ('email','appel','reunion','sms','note','visite','autre'));
COMMIT;
