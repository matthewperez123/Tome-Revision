export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      _quarantine_questions: {
        Row: {
          category: string | null
          correct_answer: string | null
          correct_option: string
          created_at: string | null
          distractor_eliminations: Json | null
          explanation: string
          hints: Json | null
          id: string
          meta: Json | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          options: Json | null
          order: number | null
          quarantined_at: string
          question_text: string
          quiz_id: string
          reason: string
          type: string
        }
        Insert: {
          category?: string | null
          correct_answer?: string | null
          correct_option: string
          created_at?: string | null
          distractor_eliminations?: Json | null
          explanation: string
          hints?: Json | null
          id?: string
          meta?: Json | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          options?: Json | null
          order?: number | null
          quarantined_at?: string
          question_text: string
          quiz_id: string
          reason: string
          type?: string
        }
        Update: {
          category?: string | null
          correct_answer?: string | null
          correct_option?: string
          created_at?: string | null
          distractor_eliminations?: Json | null
          explanation?: string
          hints?: Json | null
          id?: string
          meta?: Json | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          options?: Json | null
          order?: number | null
          quarantined_at?: string
          question_text?: string
          quiz_id?: string
          reason?: string
          type?: string
        }
        Relationships: []
      }
      _quarantine_quizzes: {
        Row: {
          book_id: string
          chapter_index: number | null
          created_at: string | null
          difficulty: string
          hint_point_penalty: number
          hints_enabled: boolean
          id: string
          quarantined_at: string
          question_count: number
          reason: string
          title: string
        }
        Insert: {
          book_id: string
          chapter_index?: number | null
          created_at?: string | null
          difficulty: string
          hint_point_penalty?: number
          hints_enabled?: boolean
          id?: string
          quarantined_at?: string
          question_count?: number
          reason: string
          title: string
        }
        Update: {
          book_id?: string
          chapter_index?: number | null
          created_at?: string | null
          difficulty?: string
          hint_point_penalty?: number
          hints_enabled?: boolean
          id?: string
          quarantined_at?: string
          question_count?: number
          reason?: string
          title?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          created_at: string | null
          description: string
          earned_at: string | null
          icon: string
          id: string
          name: string
          rarity: string | null
          tradition: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          earned_at?: string | null
          icon?: string
          id?: string
          name: string
          rarity?: string | null
          tradition?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          earned_at?: string | null
          icon?: string
          id?: string
          name?: string
          rarity?: string | null
          tradition?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          actor_id: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          type: Database["public"]["Enums"]["activity_type"]
          visibility: Database["public"]["Enums"]["activity_visibility"]
        }
        Insert: {
          actor_id: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          type: Database["public"]["Enums"]["activity_type"]
          visibility?: Database["public"]["Enums"]["activity_visibility"]
        }
        Update: {
          actor_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          type?: Database["public"]["Enums"]["activity_type"]
          visibility?: Database["public"]["Enums"]["activity_visibility"]
        }
        Relationships: []
      }
      activity_reactions: {
        Row: {
          activity_id: string
          created_at: string
          kind: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          kind: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          kind?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_reactions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      annotations: {
        Row: {
          chapter_id: string
          created_at: string | null
          explanation: string
          id: string
          paragraph_index: number | null
          term: string
          type: string
        }
        Insert: {
          chapter_id: string
          created_at?: string | null
          explanation: string
          id?: string
          paragraph_index?: number | null
          term: string
          type: string
        }
        Update: {
          chapter_id?: string
          created_at?: string | null
          explanation?: string
          id?: string
          paragraph_index?: number | null
          term?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "annotations_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_item_progress: {
        Row: {
          assignment_item_id: string
          attempt_count: number
          completed_at: string | null
          id: string
          score: number | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          assignment_item_id: string
          attempt_count?: number
          completed_at?: string | null
          id?: string
          score?: number | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          assignment_item_id?: string
          attempt_count?: number
          completed_at?: string | null
          id?: string
          score?: number | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_item_progress_assignment_item_id_fkey"
            columns: ["assignment_item_id"]
            isOneToOne: false
            referencedRelation: "assignment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_item_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_items: {
        Row: {
          assignment_id: string
          book_id: string | null
          chapter_end: number | null
          chapter_start: number | null
          created_at: string
          id: string
          is_required: boolean
          kind: string
          page_end: number | null
          page_start: number | null
          platform_quiz_difficulty: string | null
          prompt: string | null
          quiz_id: string | null
          sort_order: number
          title: string | null
        }
        Insert: {
          assignment_id: string
          book_id?: string | null
          chapter_end?: number | null
          chapter_start?: number | null
          created_at?: string
          id?: string
          is_required?: boolean
          kind: string
          page_end?: number | null
          page_start?: number | null
          platform_quiz_difficulty?: string | null
          prompt?: string | null
          quiz_id?: string | null
          sort_order?: number
          title?: string | null
        }
        Update: {
          assignment_id?: string
          book_id?: string | null
          chapter_end?: number | null
          chapter_start?: number | null
          created_at?: string
          id?: string
          is_required?: boolean
          kind?: string
          page_end?: number | null
          page_start?: number | null
          platform_quiz_difficulty?: string | null
          prompt?: string | null
          quiz_id?: string | null
          sort_order?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_items_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_items_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_submissions: {
        Row: {
          annotations: Json | null
          assignment_id: string
          created_at: string | null
          excused: boolean
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          response_text: string | null
          score: number | null
          status: string | null
          student_id: string
          submitted_at: string | null
          word_count: number | null
        }
        Insert: {
          annotations?: Json | null
          assignment_id: string
          created_at?: string | null
          excused?: boolean
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          response_text?: string | null
          score?: number | null
          status?: string | null
          student_id: string
          submitted_at?: string | null
          word_count?: number | null
        }
        Update: {
          annotations?: Json | null
          assignment_id?: string
          created_at?: string | null
          excused?: boolean
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          response_text?: string | null
          score?: number | null
          status?: string | null
          student_id?: string
          submitted_at?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_targets: {
        Row: {
          assignment_id: string
          group_id: string | null
          id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          assignment_id: string
          group_id?: string | null
          id?: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          assignment_id?: string
          group_id?: string | null
          id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_targets_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_targets_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "classroom_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_targets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          annotation_target: number | null
          auto_grade: boolean | null
          book_id: string | null
          chapter_range_end: number | null
          chapter_range_start: number | null
          classroom_id: string
          created_at: string | null
          description: string | null
          discussion_prompt: string | null
          due_date: string | null
          essay_prompt: string | null
          essay_word_max: number | null
          essay_word_min: number | null
          grace_period_days: number | null
          grading_category_id: string | null
          id: string
          late_penalty_percent: number | null
          late_policy: Json | null
          package_id: string | null
          peer_review_enabled: boolean
          peer_reviewers_per_submission: number
          points_available: number | null
          quiz_id: string | null
          release_at: string | null
          scope: string
          status: string | null
          teacher_id: string
          title: string
          trial_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          annotation_target?: number | null
          auto_grade?: boolean | null
          book_id?: string | null
          chapter_range_end?: number | null
          chapter_range_start?: number | null
          classroom_id: string
          created_at?: string | null
          description?: string | null
          discussion_prompt?: string | null
          due_date?: string | null
          essay_prompt?: string | null
          essay_word_max?: number | null
          essay_word_min?: number | null
          grace_period_days?: number | null
          grading_category_id?: string | null
          id?: string
          late_penalty_percent?: number | null
          late_policy?: Json | null
          package_id?: string | null
          peer_review_enabled?: boolean
          peer_reviewers_per_submission?: number
          points_available?: number | null
          quiz_id?: string | null
          release_at?: string | null
          scope?: string
          status?: string | null
          teacher_id: string
          title: string
          trial_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          annotation_target?: number | null
          auto_grade?: boolean | null
          book_id?: string | null
          chapter_range_end?: number | null
          chapter_range_start?: number | null
          classroom_id?: string
          created_at?: string | null
          description?: string | null
          discussion_prompt?: string | null
          due_date?: string | null
          essay_prompt?: string | null
          essay_word_max?: number | null
          essay_word_min?: number | null
          grace_period_days?: number | null
          grading_category_id?: string | null
          id?: string
          late_penalty_percent?: number | null
          late_policy?: Json | null
          package_id?: string | null
          peer_review_enabled?: boolean
          peer_reviewers_per_submission?: number
          points_available?: number | null
          quiz_id?: string | null
          release_at?: string | null
          scope?: string
          status?: string | null
          teacher_id?: string
          title?: string
          trial_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_grading_category_id_fkey"
            columns: ["grading_category_id"]
            isOneToOne: false
            referencedRelation: "grading_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "plan_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_trial_id_fkey"
            columns: ["trial_id"]
            isOneToOne: false
            referencedRelation: "trials"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          bio: string | null
          birth_year: number | null
          created_at: string | null
          death_year: number | null
          era: string | null
          id: string
          name: string
          nationality: string | null
          slug: string
          works_count: number | null
        }
        Insert: {
          bio?: string | null
          birth_year?: number | null
          created_at?: string | null
          death_year?: number | null
          era?: string | null
          id?: string
          name: string
          nationality?: string | null
          slug: string
          works_count?: number | null
        }
        Update: {
          bio?: string | null
          birth_year?: number | null
          created_at?: string | null
          death_year?: number | null
          era?: string | null
          id?: string
          name?: string
          nationality?: string | null
          slug?: string
          works_count?: number | null
        }
        Relationships: []
      }
      book_page_maps: {
        Row: {
          book_id: string
          chapter_index: number | null
          end_anchor: string | null
          folio_label: string
          has_figure: boolean
          page_index: number
          section: string
          spec_version: number
          start_anchor: string | null
          word_count: number
        }
        Insert: {
          book_id: string
          chapter_index?: number | null
          end_anchor?: string | null
          folio_label: string
          has_figure?: boolean
          page_index: number
          section: string
          spec_version: number
          start_anchor?: string | null
          word_count?: number
        }
        Update: {
          book_id?: string
          chapter_index?: number | null
          end_anchor?: string | null
          folio_label?: string
          has_figure?: boolean
          page_index?: number
          section?: string
          spec_version?: number
          start_anchor?: string | null
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_page_maps_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_recommendations: {
        Row: {
          book_id: string
          created_at: string
          id: string
          message: string | null
          recipient_id: string
          responded_at: string | null
          sender_id: string
          status: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          message?: string | null
          recipient_id: string
          responded_at?: string | null
          sender_id: string
          status: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          message?: string | null
          recipient_id?: string
          responded_at?: string | null
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_recommendations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_recommendations_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_recommendations_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          author_birth_year: number | null
          author_death_year: number | null
          author_id: string
          book_intro: string | null
          chapter_count: number
          chapters_annotated: number | null
          country: string | null
          cover_colors: Json | null
          cover_image_path: string | null
          created_at: string | null
          difficulty: string
          era: string
          estimated_reading_time: string | null
          featured: boolean | null
          genres: string[] | null
          id: string
          ingestion_status: string | null
          is_tier1: boolean | null
          language: string | null
          long_description: string | null
          original_language: string | null
          painting_artist: string | null
          painting_source: string | null
          painting_title: string | null
          painting_year: string | null
          publisher: string | null
          reading_time_minutes: number
          se_slug: string | null
          series: string | null
          series_index: number | null
          slug: string | null
          source: string | null
          source_edition: string | null
          standard_ebooks_url: string | null
          subjects: string[] | null
          subtitle: string | null
          synopsis: string | null
          themes: string[] | null
          title: string
          toc_description: string | null
          tradition: string
          updated_at: string | null
          word_count: number
          year: number | null
        }
        Insert: {
          author: string
          author_birth_year?: number | null
          author_death_year?: number | null
          author_id: string
          book_intro?: string | null
          chapter_count?: number
          chapters_annotated?: number | null
          country?: string | null
          cover_colors?: Json | null
          cover_image_path?: string | null
          created_at?: string | null
          difficulty: string
          era: string
          estimated_reading_time?: string | null
          featured?: boolean | null
          genres?: string[] | null
          id: string
          ingestion_status?: string | null
          is_tier1?: boolean | null
          language?: string | null
          long_description?: string | null
          original_language?: string | null
          painting_artist?: string | null
          painting_source?: string | null
          painting_title?: string | null
          painting_year?: string | null
          publisher?: string | null
          reading_time_minutes?: number
          se_slug?: string | null
          series?: string | null
          series_index?: number | null
          slug?: string | null
          source?: string | null
          source_edition?: string | null
          standard_ebooks_url?: string | null
          subjects?: string[] | null
          subtitle?: string | null
          synopsis?: string | null
          themes?: string[] | null
          title: string
          toc_description?: string | null
          tradition: string
          updated_at?: string | null
          word_count?: number
          year?: number | null
        }
        Update: {
          author?: string
          author_birth_year?: number | null
          author_death_year?: number | null
          author_id?: string
          book_intro?: string | null
          chapter_count?: number
          chapters_annotated?: number | null
          country?: string | null
          cover_colors?: Json | null
          cover_image_path?: string | null
          created_at?: string | null
          difficulty?: string
          era?: string
          estimated_reading_time?: string | null
          featured?: boolean | null
          genres?: string[] | null
          id?: string
          ingestion_status?: string | null
          is_tier1?: boolean | null
          language?: string | null
          long_description?: string | null
          original_language?: string | null
          painting_artist?: string | null
          painting_source?: string | null
          painting_title?: string | null
          painting_year?: string | null
          publisher?: string | null
          reading_time_minutes?: number
          se_slug?: string | null
          series?: string | null
          series_index?: number | null
          slug?: string | null
          source?: string | null
          source_edition?: string | null
          standard_ebooks_url?: string | null
          subjects?: string[] | null
          subtitle?: string | null
          synopsis?: string | null
          themes?: string[] | null
          title?: string
          toc_description?: string | null
          tradition?: string
          updated_at?: string | null
          word_count?: number
          year?: number | null
        }
        Relationships: []
      }
      chapters: {
        Row: {
          book_id: string
          chapter_index: number
          content_html: string | null
          created_at: string | null
          estimated_minutes: number
          id: string
          title: string
          toc_depth: number | null
          word_count: number
        }
        Insert: {
          book_id: string
          chapter_index: number
          content_html?: string | null
          created_at?: string | null
          estimated_minutes?: number
          id: string
          title: string
          toc_depth?: number | null
          word_count?: number
        }
        Update: {
          book_id?: string
          chapter_index?: number
          content_html?: string | null
          created_at?: string | null
          estimated_minutes?: number
          id?: string
          title?: string
          toc_depth?: number | null
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_announcements: {
        Row: {
          classroom_id: string
          content: string
          created_at: string | null
          id: string
          pinned: boolean | null
          teacher_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          classroom_id: string
          content: string
          created_at?: string | null
          id?: string
          pinned?: boolean | null
          teacher_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          classroom_id?: string
          content?: string
          created_at?: string | null
          id?: string
          pinned?: boolean | null
          teacher_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classroom_announcements_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_announcements_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_group_members: {
        Row: {
          group_id: string
          user_id: string
        }
        Insert: {
          group_id: string
          user_id: string
        }
        Update: {
          group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "classroom_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_groups: {
        Row: {
          classroom_id: string
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_groups_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_members: {
        Row: {
          classroom_id: string
          id: string
          joined_at: string | null
          role: string
          student_id: string
        }
        Insert: {
          classroom_id: string
          id?: string
          joined_at?: string | null
          role?: string
          student_id: string
        }
        Update: {
          classroom_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_members_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          archived: boolean | null
          archived_at: string | null
          created_at: string | null
          description: string | null
          grade_level: string | null
          id: string
          join_code: string
          leaderboard_enabled: boolean | null
          live_presence_enabled: boolean | null
          max_students: number | null
          name: string
          subject: string | null
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          archived_at?: string | null
          created_at?: string | null
          description?: string | null
          grade_level?: string | null
          id?: string
          join_code: string
          leaderboard_enabled?: boolean | null
          live_presence_enabled?: boolean | null
          max_students?: number | null
          name: string
          subject?: string | null
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          archived_at?: string | null
          created_at?: string | null
          description?: string | null
          grade_level?: string | null
          id?: string
          join_code?: string
          leaderboard_enabled?: boolean | null
          live_presence_enabled?: boolean | null
          max_students?: number | null
          name?: string
          subject?: string | null
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_activity: {
        Row: {
          action_type: string
          avatar_url: string | null
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          user_id: string | null
          username: string
        }
        Insert: {
          action_type: string
          avatar_url?: string | null
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          username: string
        }
        Update: {
          action_type?: string
          avatar_url?: string | null
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          last_read_at: string | null
          profile_id: string
        }
        Insert: {
          conversation_id: string
          last_read_at?: string | null
          profile_id: string
        }
        Update: {
          conversation_id?: string
          last_read_at?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          classroom_id: string | null
          created_at: string
          created_by: string
          id: string
          last_message_at: string
          subject: string | null
        }
        Insert: {
          classroom_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          last_message_at?: string
          subject?: string | null
        }
        Update: {
          classroom_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          last_message_at?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cover_archive: {
        Row: {
          archived_at: string
          book_id: string
          cover_image_path: string | null
        }
        Insert: {
          archived_at?: string
          book_id: string
          cover_image_path?: string | null
        }
        Update: {
          archived_at?: string
          book_id?: string
          cover_image_path?: string | null
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          ip: string | null
          message: string | null
          name: string
          organization: string | null
          plan_interest: string | null
          role: string | null
          status: string
          student_count: number | null
          teacher_count: number | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip?: string | null
          message?: string | null
          name: string
          organization?: string | null
          plan_interest?: string | null
          role?: string | null
          status?: string
          student_count?: number | null
          teacher_count?: number | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip?: string | null
          message?: string | null
          name?: string
          organization?: string | null
          plan_interest?: string | null
          role?: string | null
          status?: string
          student_count?: number | null
          teacher_count?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      digest_runs: {
        Row: {
          sent_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          sent_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          sent_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          responded_at: string | null
          status: Database["public"]["Enums"]["friendship_status"]
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["friendship_status"]
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["friendship_status"]
        }
        Relationships: []
      }
      glosses: {
        Row: {
          definition: string
          id: string
          line: number
          phrase: string
          section_id: string
        }
        Insert: {
          definition: string
          id: string
          line: number
          phrase: string
          section_id: string
        }
        Update: {
          definition?: string
          id?: string
          line?: number
          phrase?: string
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "glosses_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_history: {
        Row: {
          ai_draft_score: number | null
          changed_at: string
          changed_by: string | null
          final_score: number | null
          grade_id: string
          id: string
          previous_feedback: string | null
          previous_graded_by: string | null
          previous_score: number | null
        }
        Insert: {
          ai_draft_score?: number | null
          changed_at?: string
          changed_by?: string | null
          final_score?: number | null
          grade_id: string
          id?: string
          previous_feedback?: string | null
          previous_graded_by?: string | null
          previous_score?: number | null
        }
        Update: {
          ai_draft_score?: number | null
          changed_at?: string
          changed_by?: string | null
          final_score?: number | null
          grade_id?: string
          id?: string
          previous_feedback?: string | null
          previous_graded_by?: string | null
          previous_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_history_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_history_previous_graded_by_fkey"
            columns: ["previous_graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          feedback: string | null
          graded_at: string
          graded_by: string | null
          id: string
          is_auto_graded: boolean
          max_score: number
          score: number | null
          submission_id: string
          was_overridden: boolean
        }
        Insert: {
          feedback?: string | null
          graded_at?: string
          graded_by?: string | null
          id?: string
          is_auto_graded?: boolean
          max_score: number
          score?: number | null
          submission_id: string
          was_overridden?: boolean
        }
        Update: {
          feedback?: string | null
          graded_at?: string
          graded_by?: string | null
          id?: string
          is_auto_graded?: boolean
          max_score?: number
          score?: number | null
          submission_id?: string
          was_overridden?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "grades_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "assignment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      grading_categories: {
        Row: {
          created_at: string
          drop_lowest: number
          id: string
          name: string
          plan_id: string
          sort_order: number
          weight: number
        }
        Insert: {
          created_at?: string
          drop_lowest?: number
          id?: string
          name: string
          plan_id: string
          sort_order?: number
          weight: number
        }
        Update: {
          created_at?: string
          drop_lowest?: number
          id?: string
          name?: string
          plan_id?: string
          sort_order?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "grading_categories_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "semester_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      group_goals: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          due_at: string | null
          group_id: string
          id: string
          target_type: Database["public"]["Enums"]["group_goal_target"]
          target_value: number
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          due_at?: string | null
          group_id: string
          id?: string
          target_type: Database["public"]["Enums"]["group_goal_target"]
          target_value: number
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          due_at?: string | null
          group_id?: string
          id?: string
          target_type?: Database["public"]["Enums"]["group_goal_target"]
          target_value?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_goals_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invites: {
        Row: {
          code: string | null
          created_at: string
          group_id: string
          id: string
          invitee_id: string | null
          inviter_id: string
          status: Database["public"]["Enums"]["group_invite_status"]
        }
        Insert: {
          code?: string | null
          created_at?: string
          group_id: string
          id?: string
          invitee_id?: string | null
          inviter_id: string
          status?: Database["public"]["Enums"]["group_invite_status"]
        }
        Update: {
          code?: string | null
          created_at?: string
          group_id?: string
          id?: string
          invitee_id?: string | null
          inviter_id?: string
          status?: Database["public"]["Enums"]["group_invite_status"]
        }
        Relationships: [
          {
            foreignKeyName: "group_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["group_member_role"]
          status: Database["public"]["Enums"]["group_member_status"]
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["group_member_role"]
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["group_member_role"]
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_notes: {
        Row: {
          author_id: string
          body: string
          created_at: string
          group_id: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body?: string
          created_at?: string
          group_id: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          group_id?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_notes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          group_id: string
          id: string
          parent_post_id: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          group_id: string
          id?: string
          parent_post_id?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          group_id?: string
          id?: string
          parent_post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "group_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      group_schedule: {
        Row: {
          chapter_or_section: string | null
          created_at: string
          group_id: string
          id: string
          label: string
          target_date: string | null
        }
        Insert: {
          chapter_or_section?: string | null
          created_at?: string
          group_id: string
          id?: string
          label: string
          target_date?: string | null
        }
        Update: {
          chapter_or_section?: string | null
          created_at?: string
          group_id?: string
          id?: string
          label?: string
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_schedule_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          book_id: string | null
          cover: string | null
          created_at: string
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["group_kind"]
          member_limit: number | null
          name: string
          owner_id: string
          privacy: Database["public"]["Enums"]["group_privacy"]
          slug: string
        }
        Insert: {
          book_id?: string | null
          cover?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind: Database["public"]["Enums"]["group_kind"]
          member_limit?: number | null
          name: string
          owner_id: string
          privacy?: Database["public"]["Enums"]["group_privacy"]
          slug: string
        }
        Update: {
          book_id?: string | null
          cover?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["group_kind"]
          member_limit?: number | null
          name?: string
          owner_id?: string
          privacy?: Database["public"]["Enums"]["group_privacy"]
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_session_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          session_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          session_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guided_session_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "guided_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_events_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_session_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          recipient_id: string | null
          sender_id: string
          session_id: string
          station_index: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type: string
          recipient_id?: string | null
          sender_id: string
          session_id: string
          station_index?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          recipient_id?: string | null
          sender_id?: string
          session_id?: string
          station_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guided_session_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "guided_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_session_participants: {
        Row: {
          current_station_index: number | null
          hints_used: number | null
          id: string
          joined_at: string
          progress_pct: number
          score: number | null
          session_id: string
          station_progress: Json | null
          status: string
          student_id: string
          submitted_at: string | null
          violation_count: number
        }
        Insert: {
          current_station_index?: number | null
          hints_used?: number | null
          id?: string
          joined_at?: string
          progress_pct?: number
          score?: number | null
          session_id: string
          station_progress?: Json | null
          status?: string
          student_id: string
          submitted_at?: string | null
          violation_count?: number
        }
        Update: {
          current_station_index?: number | null
          hints_used?: number | null
          id?: string
          joined_at?: string
          progress_pct?: number
          score?: number | null
          session_id?: string
          station_progress?: Json | null
          status?: string
          student_id?: string
          submitted_at?: string | null
          violation_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "guided_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "guided_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_participants_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_session_reflections: {
        Row: {
          content: string
          created_at: string
          id: string
          session_id: string
          station_id: string
          student_id: string
          submitted_at: string | null
          word_count: number
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          session_id: string
          station_id: string
          student_id: string
          submitted_at?: string | null
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          session_id?: string
          station_id?: string
          student_id?: string
          submitted_at?: string | null
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "guided_session_reflections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "guided_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_reflections_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "guided_session_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_reflections_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_session_stations: {
        Row: {
          book_id: string | null
          chapter_end: number | null
          chapter_start: number | null
          id: string
          min_words: number | null
          quiz_config: Json | null
          quiz_id: string | null
          reflection_prompt: string | null
          require_completion: boolean
          section_range: Json | null
          session_id: string
          settings: Json | null
          station_index: number
          target_minutes: number
          teacher_quiz_id: string | null
          title: string | null
          type: string
        }
        Insert: {
          book_id?: string | null
          chapter_end?: number | null
          chapter_start?: number | null
          id?: string
          min_words?: number | null
          quiz_config?: Json | null
          quiz_id?: string | null
          reflection_prompt?: string | null
          require_completion?: boolean
          section_range?: Json | null
          session_id: string
          settings?: Json | null
          station_index: number
          target_minutes?: number
          teacher_quiz_id?: string | null
          title?: string | null
          type: string
        }
        Update: {
          book_id?: string | null
          chapter_end?: number | null
          chapter_start?: number | null
          id?: string
          min_words?: number | null
          quiz_config?: Json | null
          quiz_id?: string | null
          reflection_prompt?: string | null
          require_completion?: boolean
          section_range?: Json | null
          session_id?: string
          settings?: Json | null
          station_index?: number
          target_minutes?: number
          teacher_quiz_id?: string | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "guided_session_stations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_stations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "guided_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_session_stations_teacher_quiz_id_fkey"
            columns: ["teacher_quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_sessions: {
        Row: {
          actual_end_at: string | null
          actual_start_at: string | null
          annotation_visibility: string
          annotations_enabled: boolean
          book_id: string | null
          chapter_index: number | null
          classroom_id: string | null
          created_at: string
          current_station_index: number | null
          description: string | null
          duration_minutes: number | null
          ended_at: string | null
          ends_at: string | null
          hints_enabled: boolean
          id: string
          join_code: string
          mode: string
          paused_at: string | null
          presence_enabled: boolean
          scheduled_start_at: string | null
          settings: Json | null
          starts_at: string | null
          status: string
          summary_data: Json | null
          teacher_id: string
          time_limit_minutes: number
          title: string | null
          trial_id: string | null
          type: string
        }
        Insert: {
          actual_end_at?: string | null
          actual_start_at?: string | null
          annotation_visibility?: string
          annotations_enabled?: boolean
          book_id?: string | null
          chapter_index?: number | null
          classroom_id?: string | null
          created_at?: string
          current_station_index?: number | null
          description?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          ends_at?: string | null
          hints_enabled?: boolean
          id?: string
          join_code: string
          mode?: string
          paused_at?: string | null
          presence_enabled?: boolean
          scheduled_start_at?: string | null
          settings?: Json | null
          starts_at?: string | null
          status?: string
          summary_data?: Json | null
          teacher_id: string
          time_limit_minutes: number
          title?: string | null
          trial_id?: string | null
          type: string
        }
        Update: {
          actual_end_at?: string | null
          actual_start_at?: string | null
          annotation_visibility?: string
          annotations_enabled?: boolean
          book_id?: string | null
          chapter_index?: number | null
          classroom_id?: string | null
          created_at?: string
          current_station_index?: number | null
          description?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          ends_at?: string | null
          hints_enabled?: boolean
          id?: string
          join_code?: string
          mode?: string
          paused_at?: string | null
          presence_enabled?: boolean
          scheduled_start_at?: string | null
          settings?: Json | null
          starts_at?: string | null
          status?: string
          summary_data?: Json | null
          teacher_id?: string
          time_limit_minutes?: number
          title?: string | null
          trial_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "guided_sessions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_sessions_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      highlights: {
        Row: {
          book_id: string
          chapter_index: number
          classroom_id: string | null
          color: string
          created_at: string
          end_offset: number | null
          id: string
          kind: string
          label: string | null
          note: string | null
          paragraph_anchor: string | null
          selected_text: string | null
          shared: boolean
          start_offset: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_index: number
          classroom_id?: string | null
          color?: string
          created_at?: string
          end_offset?: number | null
          id?: string
          kind?: string
          label?: string | null
          note?: string | null
          paragraph_anchor?: string | null
          selected_text?: string | null
          shared?: boolean
          start_offset?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_index?: number
          classroom_id?: string | null
          color?: string
          created_at?: string
          end_offset?: number | null
          id?: string
          kind?: string
          label?: string | null
          note?: string | null
          paragraph_anchor?: string | null
          selected_text?: string | null
          shared?: boolean
          start_offset?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlights_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          avatar_url: string | null
          current_book: string | null
          id: string
          streak: number
          updated_at: string | null
          user_id: string | null
          username: string
          week_start: string
          weekly_xp: number
        }
        Insert: {
          avatar_url?: string | null
          current_book?: string | null
          id?: string
          streak?: number
          updated_at?: string | null
          user_id?: string | null
          username: string
          week_start?: string
          weekly_xp?: number
        }
        Update: {
          avatar_url?: string | null
          current_book?: string | null
          id?: string
          streak?: number
          updated_at?: string | null
          user_id?: string | null
          username?: string
          week_start?: string
          weekly_xp?: number
        }
        Relationships: []
      }
      library_entries: {
        Row: {
          added_at: string
          book_id: string
          id: string
          recommended_by: string | null
          user_id: string
        }
        Insert: {
          added_at?: string
          book_id: string
          id?: string
          recommended_by?: string | null
          user_id: string
        }
        Update: {
          added_at?: string
          book_id?: string
          id?: string
          recommended_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_entries_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_entries_recommended_by_fkey"
            columns: ["recommended_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lines: {
        Row: {
          array_index: number
          number: number
          section_id: string
          speaker: string | null
          text: string
        }
        Insert: {
          array_index: number
          number: number
          section_id: string
          speaker?: string | null
          text: string
        }
        Update: {
          array_index?: number
          number?: number
          section_id?: string
          speaker?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "lines_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      live_quiz_answers: {
        Row: {
          answer: string | null
          answered_at: string
          id: string
          is_correct: boolean
          points_awarded: number
          question_index: number
          session_id: string
          student_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string
          id?: string
          is_correct?: boolean
          points_awarded?: number
          question_index: number
          session_id: string
          student_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string
          id?: string
          is_correct?: boolean
          points_awarded?: number
          question_index?: number
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_quiz_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_quiz_participants: {
        Row: {
          correct_count: number
          display_name: string
          finalized_at: string | null
          id: string
          joined_at: string
          score: number
          session_id: string
          student_id: string
        }
        Insert: {
          correct_count?: number
          display_name: string
          finalized_at?: string | null
          id?: string
          joined_at?: string
          score?: number
          session_id: string
          student_id: string
        }
        Update: {
          correct_count?: number
          display_name?: string
          finalized_at?: string | null
          id?: string
          joined_at?: string
          score?: number
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_quiz_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_quiz_sessions: {
        Row: {
          book_id: string
          chapter_index: number
          classroom_id: string
          created_at: string
          current_question_index: number
          difficulty: string
          ended_at: string | null
          host_id: string
          id: string
          question_started_at: string | null
          quiz_id: string
          status: Database["public"]["Enums"]["live_quiz_status"]
          total_questions: number
        }
        Insert: {
          book_id: string
          chapter_index?: number
          classroom_id: string
          created_at?: string
          current_question_index?: number
          difficulty?: string
          ended_at?: string | null
          host_id: string
          id?: string
          question_started_at?: string | null
          quiz_id: string
          status?: Database["public"]["Enums"]["live_quiz_status"]
          total_questions?: number
        }
        Update: {
          book_id?: string
          chapter_index?: number
          classroom_id?: string
          created_at?: string
          current_question_index?: number
          difficulty?: string
          ended_at?: string | null
          host_id?: string
          id?: string
          question_started_at?: string | null
          quiz_id?: string
          status?: Database["public"]["Enums"]["live_quiz_status"]
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "live_quiz_sessions_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_quiz_sessions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempted_at: string
          code_prefix: string
          id: string
          ip: unknown
        }
        Insert: {
          attempted_at?: string
          code_prefix: string
          id?: string
          ip?: unknown
        }
        Update: {
          attempted_at?: string
          code_prefix?: string
          id?: string
          ip?: unknown
        }
        Relationships: []
      }
      message_email_log: {
        Row: {
          conversation_id: string
          last_emailed_at: string
          profile_id: string
        }
        Insert: {
          conversation_id: string
          last_emailed_at?: string
          profile_id: string
        }
        Update: {
          conversation_id?: string
          last_emailed_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_email_log_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_email_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          email_on_classroom_invite: boolean
          email_on_new_message: boolean
          profile_id: string
          updated_at: string
        }
        Insert: {
          email_on_classroom_invite?: boolean
          email_on_new_message?: boolean
          profile_id: string
          updated_at?: string
        }
        Update: {
          email_on_classroom_invite?: boolean
          email_on_new_message?: boolean
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          payload: Json
          read_at: string | null
          recipient_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          payload?: Json
          read_at?: string | null
          recipient_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          payload?: Json
          read_at?: string | null
          recipient_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      parent_links: {
        Row: {
          consented_at: string | null
          created_at: string
          id: string
          initiated_by: string
          parent_id: string
          status: Database["public"]["Enums"]["parent_link_status"]
          student_id: string
        }
        Insert: {
          consented_at?: string | null
          created_at?: string
          id?: string
          initiated_by: string
          parent_id: string
          status?: Database["public"]["Enums"]["parent_link_status"]
          student_id: string
        }
        Update: {
          consented_at?: string | null
          created_at?: string
          id?: string
          initiated_by?: string
          parent_id?: string
          status?: Database["public"]["Enums"]["parent_link_status"]
          student_id?: string
        }
        Relationships: []
      }
      peer_review_assignments: {
        Row: {
          assigned_at: string
          id: string
          reviewer_id: string
          status: string
          submission_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          reviewer_id: string
          status: string
          submission_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          reviewer_id?: string
          status?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "peer_review_assignments_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peer_review_assignments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assignment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      peer_reviews: {
        Row: {
          feedback: string
          id: string
          peer_review_assignment_id: string
          rating: number | null
          submitted_at: string
        }
        Insert: {
          feedback: string
          id?: string
          peer_review_assignment_id: string
          rating?: number | null
          submitted_at?: string
        }
        Update: {
          feedback?: string
          id?: string
          peer_review_assignment_id?: string
          rating?: number | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "peer_reviews_peer_review_assignment_id_fkey"
            columns: ["peer_review_assignment_id"]
            isOneToOne: true
            referencedRelation: "peer_review_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_package_items: {
        Row: {
          package_id: string
          plan_item_id: string
          sort_order: number
        }
        Insert: {
          package_id: string
          plan_item_id: string
          sort_order?: number
        }
        Update: {
          package_id?: string
          plan_item_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "plan_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_package_items_plan_item_id_fkey"
            columns: ["plan_item_id"]
            isOneToOne: false
            referencedRelation: "semester_plan_items"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_packages: {
        Row: {
          created_at: string
          due_at: string | null
          grading_category_id: string | null
          id: string
          late_policy: Json
          points: number
          published_assignment_id: string | null
          release_at: string | null
          sort_order: number
          title: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          grading_category_id?: string | null
          id?: string
          late_policy?: Json
          points?: number
          published_assignment_id?: string | null
          release_at?: string | null
          sort_order?: number
          title: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          grading_category_id?: string | null
          id?: string
          late_policy?: Json
          points?: number
          published_assignment_id?: string | null
          release_at?: string | null
          sort_order?: number
          title?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_packages_grading_category_id_fkey"
            columns: ["grading_category_id"]
            isOneToOne: false
            referencedRelation: "grading_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_packages_published_assignment_id_fkey"
            columns: ["published_assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_packages_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "plan_units"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_units: {
        Row: {
          book_id: string | null
          created_at: string
          description: string | null
          ends_on: string | null
          id: string
          plan_id: string
          sort_order: number
          starts_on: string | null
          title: string
          updated_at: string
        }
        Insert: {
          book_id?: string | null
          created_at?: string
          description?: string | null
          ends_on?: string | null
          id?: string
          plan_id: string
          sort_order?: number
          starts_on?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          book_id?: string | null
          created_at?: string
          description?: string | null
          ends_on?: string | null
          id?: string
          plan_id?: string
          sort_order?: number
          starts_on?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_units_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_units_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "semester_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_streak: number
          discoverable: boolean
          display_name: string | null
          friend_code: string
          grade_levels: string[] | null
          id: string
          onboarding_completed: boolean | null
          onboarding_data: Json | null
          role: string
          school_name: string | null
          stripe_customer_id: string | null
          subject: string | null
          total_xp: number
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number
          discoverable?: boolean
          display_name?: string | null
          friend_code?: string
          grade_levels?: string[] | null
          id: string
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          role?: string
          school_name?: string | null
          stripe_customer_id?: string | null
          subject?: string | null
          total_xp?: number
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number
          discoverable?: boolean
          display_name?: string | null
          friend_code?: string
          grade_levels?: string[] | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          role?: string
          school_name?: string | null
          stripe_customer_id?: string | null
          subject?: string | null
          total_xp?: number
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          correct_answer: string | null
          correct_option: string
          created_at: string | null
          distractor_eliminations: Json | null
          explanation: string
          hints: Json | null
          id: string
          meta: Json | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          options: Json | null
          order: number | null
          question_text: string
          quiz_id: string
          type: string
        }
        Insert: {
          category?: string | null
          correct_answer?: string | null
          correct_option: string
          created_at?: string | null
          distractor_eliminations?: Json | null
          explanation: string
          hints?: Json | null
          id?: string
          meta?: Json | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          options?: Json | null
          order?: number | null
          question_text: string
          quiz_id: string
          type?: string
        }
        Update: {
          category?: string | null
          correct_answer?: string | null
          correct_option?: string
          created_at?: string | null
          distractor_eliminations?: Json | null
          explanation?: string
          hints?: Json | null
          id?: string
          meta?: Json | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          options?: Json | null
          order?: number | null
          question_text?: string
          quiz_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          book_id: string
          chapter_index: number
          created_at: string
          difficulty: string | null
          id: string
          passed: boolean
          score: number
          total_questions: number
          user_id: string
          wisdom_earned: number
        }
        Insert: {
          book_id: string
          chapter_index?: number
          created_at?: string
          difficulty?: string | null
          id?: string
          passed?: boolean
          score?: number
          total_questions?: number
          user_id: string
          wisdom_earned?: number
        }
        Update: {
          book_id?: string
          chapter_index?: number
          created_at?: string
          difficulty?: string | null
          id?: string
          passed?: boolean
          score?: number
          total_questions?: number
          user_id?: string
          wisdom_earned?: number
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          book_id: string
          chapter_index: number | null
          created_at: string | null
          difficulty: string
          hint_point_penalty: number
          hints_enabled: boolean
          id: string
          question_count: number
          title: string
        }
        Insert: {
          book_id: string
          chapter_index?: number | null
          created_at?: string | null
          difficulty: string
          hint_point_penalty?: number
          hints_enabled?: boolean
          id?: string
          question_count?: number
          title: string
        }
        Update: {
          book_id?: string
          chapter_index?: number | null
          created_at?: string | null
          difficulty?: string
          hint_point_penalty?: number
          hints_enabled?: boolean
          id?: string
          question_count?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_preferences: {
        Row: {
          prefs: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          prefs?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          prefs?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          book_id: string
          canonical_page: number | null
          chapter_index: number
          page: number | null
          paragraph_anchor: string | null
          percent: number | null
          scroll_ratio: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          canonical_page?: number | null
          chapter_index?: number
          page?: number | null
          paragraph_anchor?: string | null
          percent?: number | null
          scroll_ratio?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          canonical_page?: number | null
          chapter_index?: number
          page?: number | null
          paragraph_anchor?: string | null
          percent?: number | null
          scroll_ratio?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recitation_progress: {
        Row: {
          id: string
          level_reached: number
          passage_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          level_reached?: number
          passage_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          level_reached?: number
          passage_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          reason: string
          reporter_id: string
          status: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          status?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: string
        }
        Relationships: []
      }
      scene_annotations: {
        Row: {
          body: string
          category: string
          citation_display: string | null
          id: string
          line_end: number
          line_start: number
          section_id: string
          sources: string[] | null
          title: string
        }
        Insert: {
          body: string
          category: string
          citation_display?: string | null
          id: string
          line_end: number
          line_start: number
          section_id: string
          sources?: string[] | null
          title: string
        }
        Update: {
          body?: string
          category?: string
          citation_display?: string | null
          id?: string
          line_end?: number
          line_start?: number
          section_id?: string
          sources?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "scene_annotations_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      school_seats: {
        Row: {
          added_at: string
          id: string
          invite_email: string | null
          invite_token: string | null
          invited_at: string | null
          seat_role: string
          status: string
          subscription_user_id: string
          teacher_id: string | null
        }
        Insert: {
          added_at?: string
          id?: string
          invite_email?: string | null
          invite_token?: string | null
          invited_at?: string | null
          seat_role?: string
          status?: string
          subscription_user_id: string
          teacher_id?: string | null
        }
        Update: {
          added_at?: string
          id?: string
          invite_email?: string | null
          invite_token?: string | null
          invited_at?: string | null
          seat_role?: string
          status?: string
          subscription_user_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_seats_subscription_user_id_fkey"
            columns: ["subscription_user_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sections: {
        Row: {
          act: number | null
          created_at: string | null
          est_read_minutes: number
          id: string
          line_count: number
          scene: number | null
          scene_title: string | null
          sequence: number
          updated_at: string | null
          word_count: number
          work_id: string
        }
        Insert: {
          act?: number | null
          created_at?: string | null
          est_read_minutes?: number
          id: string
          line_count?: number
          scene?: number | null
          scene_title?: string | null
          sequence: number
          updated_at?: string | null
          word_count?: number
          work_id: string
        }
        Update: {
          act?: number | null
          created_at?: string | null
          est_read_minutes?: number
          id?: string
          line_count?: number
          scene?: number | null
          scene_title?: string | null
          sequence?: number
          updated_at?: string | null
          word_count?: number
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      semester_plan_items: {
        Row: {
          assignment_id: string | null
          book_id: string | null
          chapter_end: number | null
          chapter_refs: Json | null
          chapter_start: number | null
          created_at: string
          custom_reading: Json | null
          description: string | null
          difficulty: string | null
          due_date: string | null
          est_minutes: number | null
          guided_session_id: string | null
          has_content: boolean | null
          id: string
          is_required: boolean
          page_end: number | null
          page_start: number | null
          prompt: string | null
          rubric: Json | null
          sort_order: number
          status: string
          teacher_quiz_id: string | null
          title: string
          type: string
          unit_id: string | null
          updated_at: string
          week_id: string | null
        }
        Insert: {
          assignment_id?: string | null
          book_id?: string | null
          chapter_end?: number | null
          chapter_refs?: Json | null
          chapter_start?: number | null
          created_at?: string
          custom_reading?: Json | null
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          est_minutes?: number | null
          guided_session_id?: string | null
          has_content?: boolean | null
          id?: string
          is_required?: boolean
          page_end?: number | null
          page_start?: number | null
          prompt?: string | null
          rubric?: Json | null
          sort_order?: number
          status?: string
          teacher_quiz_id?: string | null
          title: string
          type: string
          unit_id?: string | null
          updated_at?: string
          week_id?: string | null
        }
        Update: {
          assignment_id?: string | null
          book_id?: string | null
          chapter_end?: number | null
          chapter_refs?: Json | null
          chapter_start?: number | null
          created_at?: string
          custom_reading?: Json | null
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          est_minutes?: number | null
          guided_session_id?: string | null
          has_content?: boolean | null
          id?: string
          is_required?: boolean
          page_end?: number | null
          page_start?: number | null
          prompt?: string | null
          rubric?: Json | null
          sort_order?: number
          status?: string
          teacher_quiz_id?: string | null
          title?: string
          type?: string
          unit_id?: string | null
          updated_at?: string
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "semester_plan_items_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semester_plan_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semester_plan_items_guided_session_id_fkey"
            columns: ["guided_session_id"]
            isOneToOne: false
            referencedRelation: "guided_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semester_plan_items_teacher_quiz_id_fkey"
            columns: ["teacher_quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semester_plan_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "plan_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semester_plan_items_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "semester_plan_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      semester_plan_weeks: {
        Row: {
          date_end: string | null
          date_start: string | null
          id: string
          notes: string | null
          plan_id: string
          theme: string | null
          week_index: number
        }
        Insert: {
          date_end?: string | null
          date_start?: string | null
          id?: string
          notes?: string | null
          plan_id: string
          theme?: string | null
          week_index: number
        }
        Update: {
          date_end?: string | null
          date_start?: string | null
          id?: string
          notes?: string | null
          plan_id?: string
          theme?: string | null
          week_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "semester_plan_weeks_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "semester_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      semester_plans: {
        Row: {
          cadence: Json
          class_id: string | null
          constraints: Json
          created_at: string
          generated_by_model: string | null
          generation_params: Json | null
          goals: Json
          grading_periods: Json
          id: string
          level: string | null
          meeting_days: number[]
          no_class_dates: string[]
          status: string
          teacher_id: string
          term_end: string | null
          term_start: string | null
          title: string
          updated_at: string
          weeks: number
        }
        Insert: {
          cadence?: Json
          class_id?: string | null
          constraints?: Json
          created_at?: string
          generated_by_model?: string | null
          generation_params?: Json | null
          goals?: Json
          grading_periods?: Json
          id?: string
          level?: string | null
          meeting_days?: number[]
          no_class_dates?: string[]
          status?: string
          teacher_id: string
          term_end?: string | null
          term_start?: string | null
          title: string
          updated_at?: string
          weeks?: number
        }
        Update: {
          cadence?: Json
          class_id?: string | null
          constraints?: Json
          created_at?: string
          generated_by_model?: string | null
          generation_params?: Json | null
          goals?: Json
          grading_periods?: Json
          id?: string
          level?: string | null
          meeting_days?: number[]
          no_class_dates?: string[]
          status?: string
          teacher_id?: string
          term_end?: string | null
          term_start?: string | null
          title?: string
          updated_at?: string
          weeks?: number
        }
        Relationships: [
          {
            foreignKeyName: "semester_plans_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semester_plans_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shelf_items: {
        Row: {
          book_id: string
          created_at: string
          id: string
          shelf: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          shelf: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          shelf?: string
          user_id?: string
        }
        Relationships: []
      }
      stage_directions: {
        Row: {
          after_line: number
          id: number
          section_id: string
          text: string
        }
        Insert: {
          after_line: number
          id?: number
          section_id: string
          text: string
        }
        Update: {
          after_line?: number
          id?: number
          section_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_directions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      stoa_paintings: {
        Row: {
          created_at: string | null
          curation_note: string
          curation_tier: number
          id: string
          image_url: string
          painter: string
          public_domain_status: string
          source_institution: string
          source_url: string
          title: string
          unlocking_book_id: string
          updated_at: string | null
          year: string
        }
        Insert: {
          created_at?: string | null
          curation_note?: string
          curation_tier?: number
          id: string
          image_url?: string
          painter: string
          public_domain_status?: string
          source_institution?: string
          source_url?: string
          title: string
          unlocking_book_id: string
          updated_at?: string | null
          year: string
        }
        Update: {
          created_at?: string | null
          curation_note?: string
          curation_tier?: number
          id?: string
          image_url?: string
          painter?: string
          public_domain_status?: string
          source_institution?: string
          source_url?: string
          title?: string
          unlocking_book_id?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "stoa_paintings_unlocking_book_id_fkey"
            columns: ["unlocking_book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          id: string
          received_at: string
          type: string
        }
        Insert: {
          id: string
          received_at?: string
          type: string
        }
        Update: {
          id?: string
          received_at?: string
          type?: string
        }
        Relationships: []
      }
      student_access_codes: {
        Row: {
          active: boolean
          badge_issued_at: string | null
          badge_revoked_at: string | null
          badge_token_hash: string | null
          classroom_id: string
          code: string
          code_prefix: string | null
          created_at: string
          created_by: string
          display_name: string
          rotated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          badge_issued_at?: string | null
          badge_revoked_at?: string | null
          badge_token_hash?: string | null
          classroom_id: string
          code: string
          code_prefix?: string | null
          created_at?: string
          created_by: string
          display_name: string
          rotated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          badge_issued_at?: string | null
          badge_revoked_at?: string | null
          badge_token_hash?: string | null
          classroom_id?: string
          code?: string
          code_prefix?: string | null
          created_at?: string
          created_by?: string
          display_name?: string
          rotated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_access_codes_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      student_activity: {
        Row: {
          assignment_id: string | null
          book_id: string | null
          chapter_index: number | null
          classroom_id: string
          detail: string | null
          last_seen_at: string
          surface: string
          user_id: string
        }
        Insert: {
          assignment_id?: string | null
          book_id?: string | null
          chapter_index?: number | null
          classroom_id: string
          detail?: string | null
          last_seen_at?: string
          surface: string
          user_id: string
        }
        Update: {
          assignment_id?: string | null
          book_id?: string | null
          chapter_index?: number | null
          classroom_id?: string
          detail?: string | null
          last_seen_at?: string
          surface?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_activity_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_activity_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          current_period_end: string | null
          seats: number | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          seats?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          seats?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_quiz_questions: {
        Row: {
          category: string | null
          correct_answer: string | null
          difficulty: string | null
          distractor_eliminations: Json | null
          explanation: string | null
          hints: Json | null
          id: string
          max_points: number | null
          options: Json | null
          points: number | null
          question_text: string
          question_type: string
          quiz_id: string
          reference_answer: string | null
          rubric: Json | null
          sort_order: number
          source_anchor: Json | null
        }
        Insert: {
          category?: string | null
          correct_answer?: string | null
          difficulty?: string | null
          distractor_eliminations?: Json | null
          explanation?: string | null
          hints?: Json | null
          id?: string
          max_points?: number | null
          options?: Json | null
          points?: number | null
          question_text: string
          question_type: string
          quiz_id: string
          reference_answer?: string | null
          rubric?: Json | null
          sort_order: number
          source_anchor?: Json | null
        }
        Update: {
          category?: string | null
          correct_answer?: string | null
          difficulty?: string | null
          distractor_eliminations?: Json | null
          explanation?: string | null
          hints?: Json | null
          id?: string
          max_points?: number | null
          options?: Json | null
          points?: number | null
          question_text?: string
          question_type?: string
          quiz_id?: string
          reference_answer?: string | null
          rubric?: Json | null
          sort_order?: number
          source_anchor?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_quiz_responses: {
        Row: {
          ai_feedback: string | null
          ai_rubric_breakdown: Json | null
          created_at: string
          graded_at: string | null
          graded_by: string | null
          hint_max_level: number
          hints_used: number
          id: string
          is_correct: boolean | null
          max_points: number | null
          participant_id: string | null
          question_id: string
          quiz_id: string
          response: Json | null
          score: number | null
          session_id: string | null
          student_id: string
          teacher_override: boolean
        }
        Insert: {
          ai_feedback?: string | null
          ai_rubric_breakdown?: Json | null
          created_at?: string
          graded_at?: string | null
          graded_by?: string | null
          hint_max_level?: number
          hints_used?: number
          id?: string
          is_correct?: boolean | null
          max_points?: number | null
          participant_id?: string | null
          question_id: string
          quiz_id: string
          response?: Json | null
          score?: number | null
          session_id?: string | null
          student_id: string
          teacher_override?: boolean
        }
        Update: {
          ai_feedback?: string | null
          ai_rubric_breakdown?: Json | null
          created_at?: string
          graded_at?: string | null
          graded_by?: string | null
          hint_max_level?: number
          hints_used?: number
          id?: string
          is_correct?: boolean | null
          max_points?: number | null
          participant_id?: string | null
          question_id?: string
          quiz_id?: string
          response?: Json | null
          score?: number | null
          session_id?: string | null
          student_id?: string
          teacher_override?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "teacher_quiz_responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "guided_session_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quiz_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "teacher_quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quiz_responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quiz_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "guided_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quiz_responses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_quiz_results: {
        Row: {
          answers: Json
          assignment_id: string | null
          classroom_id: string | null
          completed_at: string | null
          id: string
          percentage: number
          quiz_id: string
          score: number
          started_at: string | null
          student_id: string
          total_points: number
        }
        Insert: {
          answers: Json
          assignment_id?: string | null
          classroom_id?: string | null
          completed_at?: string | null
          id?: string
          percentage: number
          quiz_id: string
          score: number
          started_at?: string | null
          student_id: string
          total_points: number
        }
        Update: {
          answers?: Json
          assignment_id?: string | null
          classroom_id?: string | null
          completed_at?: string | null
          id?: string
          percentage?: number
          quiz_id?: string
          score?: number
          started_at?: string | null
          student_id?: string
          total_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "teacher_quiz_results_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quiz_results_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "teacher_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quiz_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_quizzes: {
        Row: {
          allow_retakes: boolean | null
          book_id: string | null
          chapter_range_end: number | null
          chapter_range_start: number | null
          created_at: string | null
          difficulty: string | null
          generated_by_model: string | null
          generation_params: Json | null
          hint_point_penalty: number
          hints_enabled: boolean
          id: string
          passing_score: number | null
          randomize_order: boolean | null
          show_answers: boolean | null
          source_scope: Json | null
          status: string | null
          teacher_id: string
          time_limit_minutes: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          allow_retakes?: boolean | null
          book_id?: string | null
          chapter_range_end?: number | null
          chapter_range_start?: number | null
          created_at?: string | null
          difficulty?: string | null
          generated_by_model?: string | null
          generation_params?: Json | null
          hint_point_penalty?: number
          hints_enabled?: boolean
          id?: string
          passing_score?: number | null
          randomize_order?: boolean | null
          show_answers?: boolean | null
          source_scope?: Json | null
          status?: string | null
          teacher_id: string
          time_limit_minutes?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          allow_retakes?: boolean | null
          book_id?: string | null
          chapter_range_end?: number | null
          chapter_range_start?: number | null
          created_at?: string | null
          difficulty?: string | null
          generated_by_model?: string | null
          generation_params?: Json | null
          hint_point_penalty?: number
          hints_enabled?: boolean
          id?: string
          passing_score?: number | null
          randomize_order?: boolean | null
          show_answers?: boolean | null
          source_scope?: Json | null
          status?: string | null
          teacher_id?: string
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_quizzes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_quizzes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_student_notes: {
        Row: {
          classroom_id: string
          content: string
          created_at: string | null
          id: string
          student_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          classroom_id: string
          content: string
          created_at?: string | null
          id?: string
          student_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          classroom_id?: string
          content?: string
          created_at?: string | null
          id?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_student_notes_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_student_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_student_notes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      term_templates: {
        Row: {
          created_at: string
          id: string
          is_shared: boolean
          name: string
          owner_id: string
          payload: Json
        }
        Insert: {
          created_at?: string
          id?: string
          is_shared?: boolean
          name: string
          owner_id: string
          payload: Json
        }
        Update: {
          created_at?: string
          id?: string
          is_shared?: boolean
          name?: string
          owner_id?: string
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "term_templates_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tome_next_bookmarks: {
        Row: {
          book_id: string
          chapter_id: string
          chapter_index: number
          created_at: string
          id: string
          note: string
          position: number
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_id: string
          chapter_index: number
          created_at?: string
          id?: string
          note?: string
          position?: number
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_id?: string
          chapter_index?: number
          created_at?: string
          id?: string
          note?: string
          position?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tome_next_bookmarks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tome_next_bookmarks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      tome_next_inventory: {
        Row: {
          acquired_at: string
          item_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          acquired_at?: string
          item_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          acquired_at?: string
          item_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: []
      }
      tome_next_notifications: {
        Row: {
          body: string
          created_at: string
          href: string
          id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          href?: string
          id?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          href?: string
          id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      tome_next_profiles: {
        Row: {
          coins: number
          created_at: string
          display_name: string
          hearts: number
          hearts_date: string
          last_activity_date: string | null
          preferences: Json
          streak: number
          user_id: string
          xp: number
        }
        Insert: {
          coins?: number
          created_at?: string
          display_name?: string
          hearts?: number
          hearts_date?: string
          last_activity_date?: string | null
          preferences?: Json
          streak?: number
          user_id: string
          xp?: number
        }
        Update: {
          coins?: number
          created_at?: string
          display_name?: string
          hearts?: number
          hearts_date?: string
          last_activity_date?: string | null
          preferences?: Json
          streak?: number
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      tome_next_progress: {
        Row: {
          book_id: string
          chapter_id: string
          chapter_index: number
          position: number
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_id: string
          chapter_index: number
          position?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_id?: string
          chapter_index?: number
          position?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tome_next_progress_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tome_next_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      tome_next_quiz_completions: {
        Row: {
          completed_at: string
          correct: number
          quiz_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          correct: number
          quiz_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          correct?: number
          quiz_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tome_next_quiz_completions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "tome_next_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      tome_next_quizzes: {
        Row: {
          book_id: string
          description: string
          id: string
          questions: Json
          title: string
        }
        Insert: {
          book_id: string
          description: string
          id: string
          questions: Json
          title: string
        }
        Update: {
          book_id?: string
          description?: string
          id?: string
          questions?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tome_next_quizzes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      tome_next_shelf: {
        Row: {
          book_id: string
          favorite: boolean
          saved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          favorite?: boolean
          saved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          favorite?: boolean
          saved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tome_next_shelf_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      tome_next_shop: {
        Row: {
          description: string
          id: string
          name: string
          price: number
        }
        Insert: {
          description: string
          id: string
          name: string
          price: number
        }
        Update: {
          description?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      traditions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      trials: {
        Row: {
          anchor_line_end: number | null
          anchor_line_start: number | null
          answer_index: number | null
          content: Json | null
          difficulty: string
          explanation: string | null
          flames: number
          id: string
          kind: string | null
          options: string[] | null
          position: number
          prompt: string | null
          section_id: string
          type: Database["public"]["Enums"]["trial_question_type"] | null
          wisdom_reward: number
        }
        Insert: {
          anchor_line_end?: number | null
          anchor_line_start?: number | null
          answer_index?: number | null
          content?: Json | null
          difficulty?: string
          explanation?: string | null
          flames?: number
          id: string
          kind?: string | null
          options?: string[] | null
          position?: number
          prompt?: string | null
          section_id: string
          type?: Database["public"]["Enums"]["trial_question_type"] | null
          wisdom_reward?: number
        }
        Update: {
          anchor_line_end?: number | null
          anchor_line_start?: number | null
          answer_index?: number | null
          content?: Json | null
          difficulty?: string
          explanation?: string | null
          flames?: number
          id?: string
          kind?: string | null
          options?: string[] | null
          position?: number
          prompt?: string | null
          section_id?: string
          type?: Database["public"]["Enums"]["trial_question_type"] | null
          wisdom_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "trials_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        Insert: {
          coins?: number
          created_at?: string | null
          current_streak?: number
          daily_goal_minutes?: number
          daily_progress_date?: string
          daily_progress_minutes?: number
          hearts?: number
          hearts_last_regen?: string | null
          last_active_date?: string | null
          longest_streak?: number
          streak_freeze_available?: boolean
          user_id: string
          xp_total?: number
        }
        Update: {
          coins?: number
          created_at?: string | null
          current_streak?: number
          daily_goal_minutes?: number
          daily_progress_date?: string
          daily_progress_minutes?: number
          hearts?: number
          hearts_last_regen?: string | null
          last_active_date?: string | null
          longest_streak?: number
          streak_freeze_available?: boolean
          user_id?: string
          xp_total?: number
        }
        Relationships: []
      }
      virgil_guided_sessions: {
        Row: {
          book_id: string
          chapter: number | null
          ended_at: string | null
          id: string
          model_used: string | null
          started_at: string
          status: Database["public"]["Enums"]["virgil_session_status"]
          summary: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          chapter?: number | null
          ended_at?: string | null
          id?: string
          model_used?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["virgil_session_status"]
          summary?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          chapter?: number | null
          ended_at?: string | null
          id?: string
          model_used?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["virgil_session_status"]
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      virgil_session_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          model: string | null
          role: Database["public"]["Enums"]["virgil_message_role"]
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          model?: string | null
          role: Database["public"]["Enums"]["virgil_message_role"]
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          model?: string | null
          role?: Database["public"]["Enums"]["virgil_message_role"]
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "virgil_session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "virgil_guided_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      virgil_task_events: {
        Row: {
          created_at: string
          id: string
          object_id: string | null
          task: string
          teacher_id: string
          usage_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          object_id?: string | null
          task: string
          teacher_id: string
          usage_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          object_id?: string | null
          task?: string
          teacher_id?: string
          usage_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "virgil_task_events_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      virgil_usage: {
        Row: {
          message_count: number
          usage_date: string
          user_id: string
        }
        Insert: {
          message_count?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          message_count?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      works: {
        Row: {
          author: string
          cover_met_object_id: string | null
          created_at: string | null
          difficulty: string | null
          est_read_minutes: number
          genre: string | null
          id: string
          language: string
          section_count: number
          source: string
          source_url: string | null
          structural_unit_type: string
          title: string
          total_lines: number
          total_words: number
          tradition: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          author: string
          cover_met_object_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          est_read_minutes?: number
          genre?: string | null
          id: string
          language?: string
          section_count?: number
          source?: string
          source_url?: string | null
          structural_unit_type?: string
          title: string
          total_lines?: number
          total_words?: number
          tradition?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          author?: string
          cover_met_object_id?: string | null
          created_at?: string | null
          difficulty?: string | null
          est_read_minutes?: number
          genre?: string | null
          id?: string
          language?: string
          section_count?: number
          source?: string
          source_url?: string | null
          structural_unit_type?: string
          title?: string
          total_lines?: number
          total_words?: number
          tradition?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      book_toc: {
        Row: {
          book_id: string | null
          chapter_index: number | null
          estimated_minutes: number | null
          title: string | null
          word_count: number | null
        }
        Insert: {
          book_id?: string | null
          chapter_index?: number | null
          estimated_minutes?: number | null
          title?: string | null
          word_count?: number | null
        }
        Update: {
          book_id?: string | null
          chapter_index?: number | null
          estimated_minutes?: number | null
          title?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _economy_load: {
        Args: never
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      _economy_normalize: {
        Args: { s: Database["public"]["Tables"]["user_stats"]["Row"] }
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "user_stats"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      _economy_save: {
        Args: { s: Database["public"]["Tables"]["user_stats"]["Row"] }
        Returns: undefined
      }
      _economy_touch: {
        Args: { s: Database["public"]["Tables"]["user_stats"]["Row"] }
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "user_stats"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      accept_group_invite: { Args: { p_invite: string }; Returns: string }
      are_friends: { Args: { p_a: string; p_b: string }; Returns: boolean }
      can_access_classroom: {
        Args: { _classroom_id: string }
        Returns: boolean
      }
      can_recommend_to: {
        Args: { p_recipient: string; p_sender: string }
        Returns: boolean
      }
      claim_email_slot: {
        Args: {
          _conversation_id: string
          _cooldown_minutes?: number
          _profile_id: string
        }
        Returns: boolean
      }
      classroom_grade_summary: {
        Args: { p_classroom: string; p_student: string }
        Returns: {
          category_id: string
          category_name: string
          earned: number
          graded_count: number
          included: boolean
          normalized_weight: number
          pct: number
          possible: number
          weight: number
        }[]
      }
      classroom_gradebook: {
        Args: { p_classroom: string }
        Returns: {
          assignment_id: string
          assignment_title: string
          assignment_type: string
          book_id: string
          chapter_end: number
          chapter_start: number
          completed_at: string
          due_date: string
          max_score: number
          points_available: number
          score: number
          source: string
          status: string
          student_id: string
          student_name: string
          student_username: string
          submission_id: string
        }[]
      }
      classroom_reading_board: {
        Args: { p_classroom: string }
        Returns: {
          avatar_url: string
          avg_score_pct: number
          books_started: number
          current_book_id: string
          current_chapter: number
          furthest_chapter: number
          last_active: string
          last_trial_at: string
          student_id: string
          student_name: string
          student_username: string
          trials_attempted: number
          trials_passed: number
        }[]
      }
      classroom_wisdom_leaderboard: {
        Args: { p_classroom: string }
        Returns: {
          avatar_url: string
          display_name: string
          student_id: string
          trials_passed: number
          wisdom: number
        }[]
      }
      consume_virgil_message: {
        Args: { p_daily_limit: number }
        Returns: boolean
      }
      create_group: {
        Args: {
          p_book_id?: string
          p_cover?: string
          p_description?: string
          p_kind: Database["public"]["Enums"]["group_kind"]
          p_member_limit?: number
          p_name: string
          p_privacy?: Database["public"]["Enums"]["group_privacy"]
        }
        Returns: {
          book_id: string | null
          cover: string | null
          created_at: string
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["group_kind"]
          member_limit: number | null
          name: string
          owner_id: string
          privacy: Database["public"]["Enums"]["group_privacy"]
          slug: string
        }
        SetofOptions: {
          from: "*"
          to: "groups"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_notification: {
        Args: {
          p_actor?: string
          p_entity_id?: string
          p_entity_type?: string
          p_payload?: Json
          p_recipient: string
          p_type: Database["public"]["Enums"]["notification_type"]
        }
        Returns: string
      }
      economy_add_minutes: {
        Args: { p_minutes: number }
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      economy_award: {
        Args: { p_coins?: number; p_xp?: number }
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      economy_buy_streak_freeze: {
        Args: never
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      economy_lose_heart: {
        Args: never
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      economy_refill_hearts: {
        Args: never
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      economy_set_daily_goal: {
        Args: { p_minutes: number }
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      economy_sync: {
        Args: never
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      economy_use_streak_freeze: {
        Args: never
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      finalize_live_quiz_for_me: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      find_friend_candidate_by_code: {
        Args: { p_code: string }
        Returns: {
          avatar_url: string
          display_name: string
          id: string
          username: string
        }[]
      }
      find_friend_candidate_by_handle: {
        Args: { p_handle: string }
        Returns: {
          avatar_url: string
          display_name: string
          id: string
          username: string
        }[]
      }
      find_user_by_link_code: {
        Args: { p_code: string }
        Returns: {
          avatar_url: string
          display_name: string
          id: string
          role: string
          username: string
        }[]
      }
      group_is_visible: {
        Args: { p_group: string; p_uid: string }
        Returns: boolean
      }
      group_member_progress: {
        Args: { p_group: string }
        Returns: {
          avatar_url: string
          chapter_index: number
          display_name: string
          role: Database["public"]["Enums"]["group_member_role"]
          updated_at: string
          user_id: string
          username: string
        }[]
      }
      group_trials_leaderboard: {
        Args: { p_group: string }
        Returns: {
          avatar_url: string
          avg_score: number
          display_name: string
          last_trial_at: string
          role: Database["public"]["Enums"]["group_member_role"]
          total_wisdom: number
          trials_passed: number
          user_id: string
          username: string
        }[]
      }
      is_active_parent_link: {
        Args: { p_parent: string; p_student: string }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { _conversation_id: string; _uid: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { p_group: string; p_uid: string }
        Returns: boolean
      }
      is_group_moderator: {
        Args: { p_group: string; p_uid: string }
        Returns: boolean
      }
      is_guided_session_participant: {
        Args: { p_session: string }
        Returns: boolean
      }
      is_guided_session_teacher: {
        Args: { p_session: string }
        Returns: boolean
      }
      is_school_member: {
        Args: { p_subscription_user: string; p_user: string }
        Returns: boolean
      }
      is_student: { Args: { p_uid: string }; Returns: boolean }
      join_group: {
        Args: { p_group: string }
        Returns: Database["public"]["Enums"]["group_member_status"]
      }
      join_group_by_code: { Args: { p_code: string }; Returns: string }
      join_live_quiz: { Args: { p_session_id: string }; Returns: string }
      parent_child_achievements: {
        Args: { p_limit?: number; p_student: string }
        Returns: {
          description: string
          earned_at: string
          icon: string
          name: string
          rarity: string
        }[]
      }
      parent_child_activity: {
        Args: { p_limit?: number; p_student: string }
        Returns: {
          book_id: string
          detail: string
          kind: string
          occurred_at: string
        }[]
      }
      parent_child_overview: {
        Args: { p_student: string }
        Returns: {
          achievements_count: number
          active_days_30: number
          avatar_url: string
          avg_score: number
          books_started: number
          chapters_read: number
          current_streak: number
          display_name: string
          last_active_at: string
          student_id: string
          total_wisdom: number
          trials_passed: number
          username: string
        }[]
      }
      record_activity: {
        Args: {
          p_entity_id?: string
          p_entity_type?: string
          p_type: Database["public"]["Enums"]["activity_type"]
          p_visibility?: Database["public"]["Enums"]["activity_visibility"]
        }
        Returns: string
      }
      record_trial_result: {
        Args: {
          p_book_id: string
          p_chapter_index: number
          p_correct: number
          p_difficulty: string
          p_total: number
        }
        Returns: {
          coins: number
          created_at: string | null
          current_streak: number
          daily_goal_minutes: number
          daily_progress_date: string
          daily_progress_minutes: number
          hearts: number
          hearts_last_regen: string | null
          last_active_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          user_id: string
          xp_total: number
        }
        SetofOptions: {
          from: "*"
          to: "user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      shares_classroom: { Args: { _a: string; _b: string }; Returns: boolean }
      staff_can_view_student: {
        Args: { p_student_id: string }
        Returns: boolean
      }
      start_conversation: {
        Args: {
          _classroom_id: string
          _first_message: string
          _recipient_ids: string[]
          _subject: string
        }
        Returns: string
      }
      submit_live_quiz_answer: {
        Args: {
          p_answer: string
          p_question_index: number
          p_session_id: string
        }
        Returns: Json
      }
      tome_next_ensure_profile: {
        Args: never
        Returns: {
          coins: number
          created_at: string
          display_name: string
          hearts: number
          hearts_date: string
          last_activity_date: string | null
          preferences: Json
          streak: number
          user_id: string
          xp: number
        }
        SetofOptions: {
          from: "*"
          to: "tome_next_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      tome_next_purchase: {
        Args: { p_item_id: string; p_request_id: string }
        Returns: Json
      }
      tome_next_submit_quiz: {
        Args: { p_answers: number[]; p_quiz_id: string; p_request_id: string }
        Returns: Json
      }
      tome_next_update_profile: {
        Args: { p_display_name: string; p_preferences: Json }
        Returns: {
          coins: number
          created_at: string
          display_name: string
          hearts: number
          hearts_date: string
          last_activity_date: string | null
          preferences: Json
          streak: number
          user_id: string
          xp: number
        }
        SetofOptions: {
          from: "*"
          to: "tome_next_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      user_has_classroom_role: {
        Args: { p_classroom_id: string; p_roles: string[]; p_user_id: string }
        Returns: boolean
      }
      user_is_classroom_member: {
        Args: { p_classroom: string; p_user: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_type:
        | "book_started"
        | "book_completed"
        | "trial_passed"
        | "seal_earned"
        | "club_joined"
        | "session_completed"
      activity_visibility: "private" | "friends" | "public"
      friendship_status: "pending" | "accepted" | "declined" | "blocked"
      group_goal_target: "chapters" | "trials" | "minutes"
      group_invite_status: "pending" | "accepted" | "declined" | "revoked"
      group_kind: "book_club" | "study_group"
      group_member_role: "owner" | "moderator" | "member"
      group_member_status: "active" | "invited" | "removed"
      group_privacy: "public" | "private" | "invite"
      live_quiz_status: "lobby" | "question" | "reveal" | "ended"
      notification_type:
        | "friend_request"
        | "friend_accepted"
        | "group_invite"
        | "group_post"
        | "class_assignment"
        | "assignment_graded"
        | "parent_link_request"
        | "session_summary"
        | "peer_review"
        | "book_recommendation"
        | "system"
        | "message"
      parent_link_status: "pending" | "active" | "revoked"
      trial_question_type:
        | "fill_the_line"
        | "find_the_evidence"
        | "word_in_context"
        | "match_pairs"
        | "who_said_it"
        | "recitation"
      virgil_message_role: "user" | "virgil" | "system"
      virgil_session_status: "active" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "book_started",
        "book_completed",
        "trial_passed",
        "seal_earned",
        "club_joined",
        "session_completed",
      ],
      activity_visibility: ["private", "friends", "public"],
      friendship_status: ["pending", "accepted", "declined", "blocked"],
      group_goal_target: ["chapters", "trials", "minutes"],
      group_invite_status: ["pending", "accepted", "declined", "revoked"],
      group_kind: ["book_club", "study_group"],
      group_member_role: ["owner", "moderator", "member"],
      group_member_status: ["active", "invited", "removed"],
      group_privacy: ["public", "private", "invite"],
      live_quiz_status: ["lobby", "question", "reveal", "ended"],
      notification_type: [
        "friend_request",
        "friend_accepted",
        "group_invite",
        "group_post",
        "class_assignment",
        "assignment_graded",
        "parent_link_request",
        "session_summary",
        "peer_review",
        "book_recommendation",
        "system",
        "message",
      ],
      parent_link_status: ["pending", "active", "revoked"],
      trial_question_type: [
        "fill_the_line",
        "find_the_evidence",
        "word_in_context",
        "match_pairs",
        "who_said_it",
        "recitation",
      ],
      virgil_message_role: ["user", "virgil", "system"],
      virgil_session_status: ["active", "completed"],
    },
  },
} as const
