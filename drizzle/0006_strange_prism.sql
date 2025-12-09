CREATE TABLE "user_budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"monthly_budget_micros" integer DEFAULT 0 NOT NULL,
	"alert_threshold" integer DEFAULT 80 NOT NULL,
	"alert_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_budgets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_pricing_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"input_token_price_micros" integer DEFAULT 1250 NOT NULL,
	"output_text_price_micros" integer DEFAULT 5000 NOT NULL,
	"output_image_price_micros" integer DEFAULT 40000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_pricing_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "prompt_token_count" integer;--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "candidates_token_count" integer;--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "total_token_count" integer;--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "usage_metadata" jsonb;--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "estimated_cost_micros" integer;--> statement-breakpoint
ALTER TABLE "user_budgets" ADD CONSTRAINT "user_budgets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pricing_settings" ADD CONSTRAINT "user_pricing_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_budgets_user_id_idx" ON "user_budgets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_pricing_settings_user_id_idx" ON "user_pricing_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generations_created_at_idx" ON "generations" USING btree ("created_at");