export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string
          option1: string | null
          option2: string | null
          option3: string | null
          option4: string | null
          subsectionid: number | null
          title: string | null
        }
        Insert: {
          id?: string
          option1?: string | null
          option2?: string | null
          option3?: string | null
          option4?: string | null
          subsectionid?: number | null
          title?: string | null
        }
        Update: {
          id?: string
          option1?: string | null
          option2?: string | null
          option3?: string | null
          option4?: string | null
          subsectionid?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_subsectionid_fkey"
            columns: ["subsectionid"]
            isOneToOne: false
            referencedRelation: "subsections"
            referencedColumns: ["id"]
          }
        ]
      }
      sections: {
        Row: {
          from25to50: string | null
          from50to75: string | null
          from75to100: string | null
          id: string
          surveyid: string | null
          title: string | null
        }
        Insert: {
          from25to50?: string | null
          from50to75?: string | null
          from75to100?: string | null
          id?: string
          surveyid?: string | null
          title?: string | null
        }
        Update: {
          from25to50?: string | null
          from50to75?: string | null
          from75to100?: string | null
          id?: string
          surveyid?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_surveyid_fkey"
            columns: ["surveyid"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          }
        ]
      }
      subsections: {
        Row: {
          id: number
          sectionid: string | null
          title: string | null
        }
        Insert: {
          id?: number
          sectionid?: string | null
          title?: string | null
        }
        Update: {
          id?: number
          sectionid?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subsections_sectionid_fkey"
            columns: ["sectionid"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          }
        ]
      }
      surveys: {
        Row: {
          description: string | null
          id: string
          role: string | null
          title: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          role?: string | null
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          role?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
