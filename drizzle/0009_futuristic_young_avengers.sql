CREATE TABLE "image_favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_favorites_unique" UNIQUE("image_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "image_tag_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_tag_assignments_unique" UNIQUE("image_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "image_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#6366f1' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_tags_unique_name" UNIQUE("user_id","name")
);
--> statement-breakpoint
ALTER TABLE "generated_images" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "builder_config" jsonb;--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "image_favorites" ADD CONSTRAINT "image_favorites_image_id_generated_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."generated_images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_favorites" ADD CONSTRAINT "image_favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_tag_assignments" ADD CONSTRAINT "image_tag_assignments_image_id_generated_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."generated_images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_tag_assignments" ADD CONSTRAINT "image_tag_assignments_tag_id_image_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."image_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_tags" ADD CONSTRAINT "image_tags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "image_favorites_image_id_idx" ON "image_favorites" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX "image_favorites_user_id_idx" ON "image_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "image_tag_assignments_image_id_idx" ON "image_tag_assignments" USING btree ("image_id");--> statement-breakpoint
CREATE INDEX "image_tag_assignments_tag_id_idx" ON "image_tag_assignments" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "image_tags_user_id_idx" ON "image_tags" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generations_deleted_at_idx" ON "generations" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "generated_images" ADD CONSTRAINT "generated_images_share_token_unique" UNIQUE("share_token");