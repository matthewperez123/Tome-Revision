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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
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
      assignment_submissions: {
        Row: {
          annotations: Json | null
          assignment_id: string
          created_at: string | null
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
          id: string
          late_penalty_percent: number | null
          peer_review_enabled: boolean
          peer_reviewers_per_submission: number
          points_available: number | null
          quiz_id: string | null
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
          id?: string
          late_penalty_percent?: number | null
          peer_review_enabled?: boolean
          peer_reviewers_per_submission?: number
          points_available?: number | null
          quiz_id?: string | null
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
          id?: string
          late_penalty_percent?: number | null
          peer_review_enabled?: boolean
          peer_reviewers_per_submission?: number
          points_available?: number | null
          quiz_id?: string | null
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
          changed_at: string
          changed_by: string
          grade_id: string
          id: string
          previous_feedback: string | null
          previous_graded_by: string | null
          previous_score: number | null
        }
        Insert: {
          changed_at?: string
          changed_by: string
          grade_id: string
          id?: string
          previous_feedback?: string | null
          previous_graded_by?: string | null
          previous_score?: number | null
        }
        Update: {
          changed_at?: string
          changed_by?: string
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
      highlights: {
        Row: {
          book_id: string
          chapter_index: number
          classroom_id: string | null
          color: string
          created_at: string
          end_offset: number
          id: string
          note: string | null
          selected_text: string
          shared: boolean
          start_offset: number
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_index: number
          classroom_id?: string | null
          color?: string
          created_at?: string
          end_offset: number
          id?: string
          note?: string | null
          selected_text: string
          shared?: boolean
          start_offset: number
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_index?: number
          classroom_id?: string | null
          color?: string
          created_at?: string
          end_offset?: number
          id?: string
          note?: string | null
          selected_text?: string
          shared?: boolean
          start_offset?: number
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
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
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
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
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
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
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
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
      school_seats: {
        Row: {
          id: string
          subscription_user_id: string
          teacher_id: string
          seat_role: string
          added_at: string
        }
        Insert: {
          id?: string
          subscription_user_id: string
          teacher_id: string
          seat_role?: string
          added_at?: string
        }
        Update: {
          id?: string
          subscription_user_id?: string
          teacher_id?: string
          seat_role?: string
          added_at?: string
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
      demo_requests: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          organization: string | null
          role: string | null
          plan_interest: string | null
          student_count: number | null
          teacher_count: number | null
          message: string | null
          status: string
          ip: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          organization?: string | null
          role?: string | null
          plan_interest?: string | null
          student_count?: number | null
          teacher_count?: number | null
          message?: string | null
          status?: string
          ip?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          organization?: string | null
          role?: string | null
          plan_interest?: string | null
          student_count?: number | null
          teacher_count?: number | null
          message?: string | null
          status?: string
          ip?: string | null
          user_agent?: string | null
        }
        Relationships: []
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
      virgil_usage: {
        Row: {
          user_id: string
          usage_date: string
          message_count: number
        }
        Insert: {
          user_id: string
          usage_date?: string
          message_count?: number
        }
        Update: {
          user_id?: string
          usage_date?: string
          message_count?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          correct_answer: string | null
          correct_option: string
          created_at: string | null
          explanation: string
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
          explanation: string
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
          explanation?: string
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
      quizzes: {
        Row: {
          book_id: string
          created_at: string | null
          difficulty: string
          id: string
          question_count: number
          title: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          difficulty: string
          id?: string
          question_count?: number
          title: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          difficulty?: string
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
          chapter_index: number
          page: number | null
          scroll_ratio: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_index?: number
          page?: number | null
          scroll_ratio?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_index?: number
          page?: number | null
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
      study_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          archived_at: string | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_teacher_led: boolean
          join_code: string
          name: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_teacher_led?: boolean
          join_code: string
          name: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_teacher_led?: boolean
          join_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_groups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_quiz_questions: {
        Row: {
          correct_answer: string
          difficulty: string | null
          explanation: string | null
          id: string
          options: Json | null
          points: number | null
          question_text: string
          question_type: string
          quiz_id: string
          sort_order: number
        }
        Insert: {
          correct_answer: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number | null
          question_text: string
          question_type: string
          quiz_id: string
          sort_order: number
        }
        Update: {
          correct_answer?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          points?: number | null
          question_text?: string
          question_type?: string
          quiz_id?: string
          sort_order?: number
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
          id: string
          passing_score: number | null
          randomize_order: boolean | null
          show_answers: boolean | null
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
          id?: string
          passing_score?: number | null
          randomize_order?: boolean | null
          show_answers?: boolean | null
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
          id?: string
          passing_score?: number | null
          randomize_order?: boolean | null
          show_answers?: boolean | null
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
      can_access_classroom: {
        Args: { _classroom_id: string }
        Returns: boolean
      }
      can_recommend_to: {
        Args: { p_recipient: string; p_sender: string }
        Returns: boolean
      }
      consume_virgil_message: {
        Args: { p_daily_limit: number }
        Returns: boolean
      }
      is_school_member: {
        Args: { p_user: string; p_subscription_user: string }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_recipient: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_actor?: string
          p_entity_type?: string
          p_entity_id?: string
          p_payload?: Json
        }
        Returns: string
      }
      classroom_reading_board: {
        Args: { p_classroom: string }
        Returns: {
          student_id: string
          student_name: string | null
          student_username: string | null
          avatar_url: string | null
          last_active: string | null
          current_book_id: string | null
          current_chapter: number | null
          furthest_chapter: number | null
          books_started: number
          trials_attempted: number
          trials_passed: number
          avg_score_pct: number | null
          last_trial_at: string | null
        }[]
      }
      staff_can_view_student: {
        Args: { p_student_id: string }
        Returns: boolean
      }
      classroom_wisdom_leaderboard: {
        Args: { p_classroom: string }
        Returns: {
          student_id: string
          display_name: string | null
          avatar_url: string | null
          wisdom: number
          trials_passed: number
        }[]
      }
      claim_email_slot: {
        Args: {
          _conversation_id: string
          _cooldown_minutes?: number
          _profile_id: string
        }
        Returns: boolean
      }
      find_friend_candidate_by_code: {
        Args: { p_code: string }
        Returns: {
          id: string
          display_name: string | null
          username: string | null
          avatar_url: string | null
        }[]
      }
      find_friend_candidate_by_handle: {
        Args: { p_handle: string }
        Returns: {
          id: string
          display_name: string | null
          username: string | null
          avatar_url: string | null
        }[]
      }
      is_conversation_participant: {
        Args: { _conversation_id: string; _uid: string }
        Returns: boolean
      }
      shares_classroom: { Args: { _a: string; _b: string }; Returns: boolean }
      start_conversation: {
        Args: {
          _classroom_id: string
          _first_message: string
          _recipient_ids: string[]
          _subject: string
        }
        Returns: string
      }
      user_has_classroom_role: {
        Args: { p_classroom_id: string; p_roles: string[]; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      friendship_status: "pending" | "accepted" | "declined" | "blocked"
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
      trial_question_type:
        | "fill_the_line"
        | "find_the_evidence"
        | "word_in_context"
        | "match_pairs"
        | "who_said_it"
        | "recitation"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      trial_question_type: [
        "fill_the_line",
        "find_the_evidence",
        "word_in_context",
        "match_pairs",
        "who_said_it",
        "recitation",
      ],
    },
  },
} as const

