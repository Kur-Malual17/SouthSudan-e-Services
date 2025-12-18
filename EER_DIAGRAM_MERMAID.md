# South Sudan Immigration Portal - EER Diagram (Mermaid)

## Option 1: Mermaid.js (Recommended - Works in GitHub, VS Code, many tools)

### How to Use:
1. **GitHub**: Paste in README.md or any .md file
2. **Mermaid Live Editor**: https://mermaid.live/
3. **VS Code**: Install "Markdown Preview Mermaid Support" extension
4. **Draw.io**: Import → Advanced → Mermaid

### Copy the code below:

```mermaid
erDiagram
    User ||--|| UserProfile : "has"
    User ||--o{ Application : "submits"
    User ||--o{ Application : "reviews"
    User ||--o{ Application : "verifies_payment"
    User ||--o{ NewsArticle : "authors"
    User ||--o{ BlogPost : "authors"
    
    User {
        int id PK
        string username UK
        string email UK
        string password
        string first_name
        string last_name
        boolean is_staff
        boolean is_active
        datetime date_joined
    }
    
    UserProfile {
        int id PK
        int user_id FK
        string phone_number
        string role "applicant|officer|supervisor|admin"
        boolean is_active
        datetime created_at
    }
    
    Application {
        int id PK
        int user_id FK
        int reviewed_by_id FK
        int payment_verified_by_id FK
        string application_type "passport-first|passport-replacement|nationalid-first|nationalid-replacement"
        string status "pending|in-progress|approved|rejected|collected"
        string confirmation_number UK "SS-IMM-XXXXXXX-XXX"
        string applicant_type "above18|below18"
        string national_id_number
        string first_name
        string last_name
        string middle_name
        date date_of_birth
        string gender "male|female"
        string nationality
        string father_name
        string mother_name
        string marital_status "single|married|divorced|widowed"
        string profession
        string employer
        int height
        string other_nationality
        string other_passport_number
        string phone_number
        string email
        string country
        string state
        string city
        string place_of_residence
        string birth_country
        string birth_state
        string birth_city
        string passport_type "2-year|5-year|10-year"
        string travel_purpose
        string destination_country
        string destination_city
        string replacement_reason "lost|stolen|damaged|expired|correction"
        file photo
        file id_copy
        file signature
        file birth_certificate
        file old_document
        file police_report
        string civil_registry_number
        string payment_status "pending|completed|failed"
        string payment_method "momo|credit_card|bank"
        decimal payment_amount
        string payment_reference
        file payment_proof
        string payment_proof_hash "SHA-256"
        datetime payment_date
        datetime payment_verified_at
        text payment_rejection_reason
        datetime reviewed_at
        text rejection_reason
        file approved_pdf
        datetime created_at
        datetime updated_at
    }
    
    NewsArticle {
        int id PK
        int author_id FK
        string title
        string title_ar "Arabic"
        text content
        text content_ar "Arabic"
        string excerpt "max 300 chars"
        string excerpt_ar "Arabic"
        file image
        string author_name "Manual entry"
        boolean published
        boolean featured
        datetime created_at
        datetime updated_at
    }
    
    BlogPost {
        int id PK
        int author_id FK
        string title
        string title_ar "Arabic"
        text content
        text content_ar "Arabic"
        string excerpt "max 300 chars"
        string excerpt_ar "Arabic"
        file image
        string author_name "Manual entry"
        string category "Tips|Updates|Guides"
        boolean published
        boolean featured
        datetime created_at
        datetime updated_at
    }
```

---

## How to Generate the Diagram:

### Method 1: Mermaid Live Editor (Easiest)
1. Go to: https://mermaid.live/
2. Paste the code above
3. Click "Download PNG" or "Download SVG"
4. Done! ✅

### Method 2: VS Code
1. Install extension: "Markdown Preview Mermaid Support"
2. Create a .md file and paste the code
3. Press `Ctrl+Shift+V` to preview
4. Right-click → "Export to PNG/SVG"

### Method 3: GitHub
1. Create a README.md in your repo
2. Paste the code
3. GitHub automatically renders it
4. Take a screenshot

### Method 4: Draw.io (diagrams.net)
1. Go to: https://app.diagrams.net/
2. File → Import from → Advanced → Mermaid
3. Paste the code
4. Edit and export

---

## Relationship Legend:

- `||--||` : One-to-One (exactly one)
- `||--o{` : One-to-Many (one to zero or more)
- `}o--o{` : Many-to-Many (zero or more to zero or more)
- `PK` : Primary Key
- `FK` : Foreign Key
- `UK` : Unique Key

---

## Notes:

1. **Mermaid is the most popular** because it's:
   - Free and open-source
   - Works in GitHub, GitLab, VS Code
   - Easy to version control (it's just text)
   - Automatically renders in many platforms

2. **The diagram shows**:
   - All entities (tables)
   - All relationships
   - Key attributes
   - Data types
   - Constraints (PK, FK, UK)

3. **For a more detailed view**, you can add more attributes or split into multiple diagrams.

---

## Alternative: Simplified Version (if too complex)

```mermaid
erDiagram
    User ||--|| UserProfile : has
    User ||--o{ Application : submits
    User ||--o{ NewsArticle : creates
    User ||--o{ BlogPost : creates
    
    User {
        int id PK
        string username
        string email
    }
    
    UserProfile {
        int id PK
        int user_id FK
        string role
        string phone_number
    }
    
    Application {
        int id PK
        int user_id FK
        string confirmation_number UK
        string application_type
        string status
        string first_name
        string last_name
        date date_of_birth
        string payment_status
        datetime created_at
    }
    
    NewsArticle {
        int id PK
        int author_id FK
        string title
        text content
        boolean published
        boolean featured
    }
    
    BlogPost {
        int id PK
        int author_id FK
        string title
        text content
        string category
        boolean published
        boolean featured
    }
```

This simplified version is easier to read and understand at a glance!
