# Feature Specification: WhatsApp Group Social Proof Image Generator

**Feature Branch**: `001-whatsapp-proof-generator`
**Created**: 2026-01-11
**Status**: Draft
**Input**: User description: "Crie uma feature que gera imagens de provas sociais do whatsapp e deve reproduzir uma tela de whatsapp exatamente e especialmente de um grupo de whatsapp. Os inputs que devem existir Nome do Grupo que fica no topo da imagem . Deve ter a seguinte entrada e devem ser tabs onde é possivel Adicionar : "pessoa 1" , "pessoa 2" e por assim adiante e deve ter uma opcao de adicionar mais pessoas . E deve ter uma nova ABA "Gerador de Provas de Whatsapp" Por enquanto ela é totalmente manual e adicionado na tela."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create WhatsApp Group Screenshot with Group Name (Priority: P1)

Admin users need to create realistic WhatsApp group screenshots to use as social proof on landing pages. They access the generator, enter a group name, and see a preview of a WhatsApp group header that looks authentic.

**Why this priority**: This is the foundation of the feature - without the ability to create a basic WhatsApp group interface with a group name, no social proof can be generated. This delivers immediate value as admins can start creating basic social proof images.

**Independent Test**: Can be fully tested by navigating to the new "Gerador de Provas de Whatsapp" tab in the admin panel, entering a group name like "Grupo VIP Shopee", and verifying that a WhatsApp-style group header appears with the correct name.

**Acceptance Scenarios**:

1. **Given** admin is in the parametrization panel, **When** they click on "Gerador de Provas de Whatsapp" tab, **Then** they see an empty WhatsApp group screenshot generator interface
2. **Given** the generator interface is open, **When** admin enters "Grupo de Ofertas" in the group name field, **Then** the preview updates to show a WhatsApp group header with "Grupo de Ofertas" at the top
3. **Given** admin has entered a group name, **When** they view the preview, **Then** the interface accurately reproduces WhatsApp's visual design including colors, fonts, and layout

---

### User Story 2 - Add Multiple Participant Messages (Priority: P2)

Admin users need to add messages from multiple participants to make the social proof screenshot realistic. They can add participants one by one, with each participant displayed as a separate tab/entry.

**Why this priority**: Adding messages from different people makes the social proof credible. Without this, the screenshot would just be a header. This is the second most critical piece after the foundation.

**Independent Test**: Can be fully tested by creating a group, then adding "pessoa 1" with a message, adding "pessoa 2" with another message, and verifying both appear in the WhatsApp-style chat interface in the correct order.

**Acceptance Scenarios**:

1. **Given** admin has created a WhatsApp group preview, **When** they click "Adicionar pessoa", **Then** a new participant entry form appears labeled "pessoa 1"
2. **Given** admin has added "pessoa 1", **When** they click "Adicionar pessoa" again, **Then** a new participant entry form appears labeled "pessoa 2"
3. **Given** admin has added multiple participants, **When** they enter messages for each participant, **Then** the preview shows messages in WhatsApp's chat format with correct participant names
4. **Given** admin has multiple participant tabs, **When** they switch between tabs, **Then** they can view and edit each participant's information independently

---

### User Story 3 - Remove and Reorder Participants (Priority: P3)

Admin users need the flexibility to remove participants or adjust the order of messages to create the most compelling social proof narrative.

**Why this priority**: This enhances usability by allowing corrections and adjustments, but the core functionality works without it. Admins can still create effective social proof even if they can't reorder or remove entries.

**Independent Test**: Can be fully tested by creating 3 participants, removing the middle one, and verifying the chat updates correctly. Then creating 3 new participants, reordering them, and confirming the message order changes in the preview.

**Acceptance Scenarios**:

1. **Given** admin has added 3 participants, **When** they click remove on "pessoa 2", **Then** only "pessoa 1" and "pessoa 3" remain, and "pessoa 3" is renumbered to "pessoa 2"
2. **Given** admin has multiple participants, **When** they drag to reorder participants, **Then** the preview updates to show messages in the new order

---

### User Story 4 - Download WhatsApp Screenshot (Priority: P1)

Admin users need to export the generated WhatsApp screenshot as an image file to use it on landing pages and marketing materials.

**Why this priority**: Without the ability to download/export, the generator is useless. This is equally critical as creating the basic interface. However, it depends on P1 Story 1 and P2 Story 2 being complete first.

**Independent Test**: Can be fully tested by creating a complete WhatsApp group screenshot with group name and messages, clicking a download/export button, and verifying a PNG or JPG image is saved to the device that accurately matches the preview.

**Acceptance Scenarios**:

1. **Given** admin has created a complete WhatsApp screenshot with group name and messages, **When** they click "Download" or "Export", **Then** an image file is generated and downloaded to their device
2. **Given** the exported image is opened, **When** admin views it, **Then** it exactly matches the preview shown in the generator
3. **Given** admin exports the image, **When** they use it on a landing page, **Then** the image appears identical to a real WhatsApp screenshot

---

### Edge Cases

- What happens when admin enters an extremely long group name (100+ characters)?
- What happens when admin enters special characters or emojis in group names or messages?
- What happens when admin tries to add more than 50 participants?
- What happens when admin leaves the group name empty and tries to export?
- What happens when admin leaves participant messages empty?
- How does the system handle different screen sizes when displaying the preview?
- What happens when admin navigates away from the tab with unsaved changes?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a new admin tab labeled "Gerador de Provas de Whatsapp" in the parametrization section
- **FR-002**: System MUST allow admin to enter a WhatsApp group name that appears at the top of the generated screenshot
- **FR-003**: System MUST display a real-time preview of the WhatsApp group screenshot as admin makes changes
- **FR-004**: System MUST accurately reproduce WhatsApp's visual design including header layout, colors (green header, white background), fonts, and spacing
- **FR-005**: System MUST allow admin to add participants using an "Adicionar pessoa" button or similar mechanism
- **FR-006**: System MUST label participants sequentially as "pessoa 1", "pessoa 2", "pessoa 3", etc.
- **FR-007**: System MUST organize participants as separate tabs or entries that can be individually selected and edited
- **FR-008**: System MUST allow admin to enter message content for each participant
- **FR-009**: System MUST display participant messages in the WhatsApp chat format with appropriate styling (message bubbles, timestamps, sender names)
- **FR-010**: System MUST support adding at least 20 participants to a single screenshot
- **FR-011**: System MUST allow admin to export/download the generated screenshot as an image file (PNG or JPG format preferred)
- **FR-012**: System MUST generate the image entirely on the client-side without requiring server processing or storage
- **FR-013**: System MUST preserve the exact visual appearance of the preview when exporting to image
- **FR-014**: System MUST allow admin to remove previously added participants
- **FR-015**: System MUST support text formatting in messages including emojis and special characters
- **FR-016**: System MUST display appropriate WhatsApp group interface elements (group icon placeholder, participant count, etc.)

### Key Entities *(include if feature involves data)*

- **WhatsApp Group Screenshot**: Represents a complete social proof image with group name, participants, and messages. Attributes include group name (text), creation timestamp, list of participants.

- **Participant Entry**: Represents a single person's contribution to the group chat. Attributes include participant number (1, 2, 3...), participant name (optional), message text, message timestamp (optional), display order.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can create a complete WhatsApp group screenshot with group name and 5 participants in under 3 minutes
- **SC-002**: Generated screenshots are visually indistinguishable from real WhatsApp group screenshots when compared side-by-side
- **SC-003**: System handles at least 20 participants without performance degradation or visual issues
- **SC-004**: Exported image files maintain 100% visual fidelity to the preview shown in the generator
- **SC-005**: The new "Gerador de Provas de Whatsapp" tab is accessible within one click from any other admin section
- **SC-006**: Admin can successfully add and remove participants without encountering errors or unexpected behavior
- **SC-007**: The preview updates in real-time (under 500ms) when admin makes changes to group name or participant messages

## Assumptions

- Admin users are familiar with WhatsApp's interface and will recognize when the reproduction is accurate
- WhatsApp's current design patterns (as of 2026) remain consistent with current visual standards
- Image export will use standard web browser download capabilities (no special permissions required)
- The feature is for creating static screenshots, not interactive chat simulations
- Each participant message will default to a simple text bubble format (no need for media attachments, voice messages, or other advanced WhatsApp features in initial version)
- Timestamps will use a default recent time format (e.g., "10:30") rather than requiring admin input
- The generator creates screenshots of incoming messages (not admin's own messages) for social proof purposes
- Group icon will use a generic placeholder or default WhatsApp group icon
- No authentication or authorization changes needed - feature uses existing admin access control
- Data is ephemeral - no need to save/persist WhatsApp screenshots in the system (admin downloads and uses elsewhere)
