# South Sudan Immigration Portal - EER Diagram (PlantUML)

## Option 2: PlantUML (Professional diagrams)

### How to Use:
1. **PlantUML Online**: http://www.plantuml.com/plantuml/uml/
2. **VS Code**: Install "PlantUML" extension
3. **IntelliJ IDEA**: Built-in support
4. **Eclipse**: Install PlantUML plugin

### Copy the code below:

```plantuml
@startuml South_Sudan_Immigration_EER

!define table(x) class x << (T,#FFAAAA) >>
!define primary_key(x) <u>x</u>
!define foreign_key(x) <i>x</i>

hide methods
hide stereotypes

' Entities
table(User) {
  primary_key(id): int
  username: varchar(150) <<UK>>
  email: varchar(254) <<UK>>
  password: varchar(128)
  first_name: varchar(150)
  last_name: varchar(150)
  is_staff: boolean
  is_active: boolean
  date_joined: datetime
}

table(UserProfile) {
  primary_key(id): int
  foreign_key(user_id): int
  phone_number: varchar(20)
  role: varchar(20)
  is_active: boolean
  created_at: datetime
}

table(Application) {
  primary_key(id): int
  foreign_key(user_id): int
  foreign_key(reviewed_by_id): int
  foreign_key(payment_verified_by_id): int
  application_type: varchar(30)
  status: varchar(20)
  confirmation_number: varchar(50) <<UK>>
  first_name: varchar(100)
  last_name: varchar(100)
  middle_name: varchar(100)
  date_of_birth: date
  gender: varchar(10)
  nationality: varchar(100)
  father_name: varchar(200)
  mother_name: varchar(200)
  marital_status: varchar(20)
  phone_number: varchar(20)
  email: varchar(254)
  country: varchar(100)
  state: varchar(100)
  city: varchar(100)
  place_of_residence: varchar(200)
  payment_status: varchar(20)
  payment_method: varchar(20)
  payment_amount: decimal(10,2)
  payment_proof_hash: varchar(64)
  created_at: datetime
  updated_at: datetime
}

table(NewsArticle) {
  primary_key(id): int
  foreign_key(author_id): int
  title: varchar(200)
  title_ar: varchar(200)
  content: text
  content_ar: text
  excerpt: varchar(300)
  excerpt_ar: varchar(300)
  image: varchar(100)
  author_name: varchar(200)
  published: boolean
  featured: boolean
  created_at: datetime
  updated_at: datetime
}

table(BlogPost) {
  primary_key(id): int
  foreign_key(author_id): int
  title: varchar(200)
  title_ar: varchar(200)
  content: text
  content_ar: text
  excerpt: varchar(300)
  excerpt_ar: varchar(300)
  image: varchar(100)
  author_name: varchar(200)
  category: varchar(100)
  published: boolean
  featured: boolean
  created_at: datetime
  updated_at: datetime
}

' Relationships
User ||--|| UserProfile : "has"
User ||--o{ Application : "submits"
User ||--o{ Application : "reviews"
User ||--o{ Application : "verifies"
User ||--o{ NewsArticle : "authors"
User ||--o{ BlogPost : "authors"

note right of Application
  **Status Flow:**
  pending → in-progress 
  → approved/rejected 
  → collected
  
  **Payment Flow:**
  pending → completed/failed
  
  **Duplicate Detection:**
  payment_proof_hash (SHA-256)
end note

note right of UserProfile
  **Roles:**
  - applicant
  - officer
  - supervisor
  - admin
end note

@enduml
```

---

## How to Generate:

### Method 1: PlantUML Online Server
1. Go to: http://www.plantuml.com/plantuml/uml/
2. Paste the code
3. Click "Submit"
4. Download PNG/SVG

### Method 2: VS Code
1. Install "PlantUML" extension
2. Create a .puml file
3. Paste the code
4. Press `Alt+D` to preview
5. Right-click → Export

### Method 3: Command Line (if you have Java)
```bash
# Install PlantUML
brew install plantuml  # Mac
# or download from https://plantuml.com/download

# Generate diagram
plantuml diagram.puml
```

---

## Simplified Version (Cleaner):

```plantuml
@startuml Immigration_Portal_Simple

skinparam linetype ortho
skinparam roundcorner 10

entity "User" as user {
  * id : int <<PK>>
  --
  * username : varchar(150) <<UK>>
  * email : varchar(254) <<UK>>
  password : varchar(128)
  first_name : varchar(150)
  last_name : varchar(150)
}

entity "UserProfile" as profile {
  * id : int <<PK>>
  --
  * user_id : int <<FK>>
  phone_number : varchar(20)
  role : varchar(20)
  is_active : boolean
}

entity "Application" as app {
  * id : int <<PK>>
  --
  * user_id : int <<FK>>
  * confirmation_number : varchar(50) <<UK>>
  application_type : varchar(30)
  status : varchar(20)
  first_name : varchar(100)
  last_name : varchar(100)
  date_of_birth : date
  payment_status : varchar(20)
  payment_proof_hash : varchar(64)
}

entity "NewsArticle" as news {
  * id : int <<PK>>
  --
  author_id : int <<FK>>
  title : varchar(200)
  content : text
  published : boolean
  featured : boolean
}

entity "BlogPost" as blog {
  * id : int <<PK>>
  --
  author_id : int <<FK>>
  title : varchar(200)
  content : text
  category : varchar(100)
  published : boolean
  featured : boolean
}

user ||--|| profile
user ||--o{ app
user ||--o{ news
user ||--o{ blog

@enduml
```

---

## Advantages of PlantUML:

1. ✅ Professional-looking diagrams
2. ✅ Highly customizable
3. ✅ Supports many diagram types
4. ✅ Version control friendly (text-based)
5. ✅ Widely used in enterprise
6. ✅ Can generate multiple formats (PNG, SVG, PDF)

---

## Tips:

- Use `skinparam` to customize colors and styles
- Use `note` to add explanations
- Use `hide` to simplify the diagram
- Use `!define` for reusable styles
