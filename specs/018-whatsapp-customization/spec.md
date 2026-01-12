# Feature Specification: WhatsApp Group Customization Features

**Feature Branch**: `018-whatsapp-customization`
**Created**: 2026-01-11
**Status**: Draft
**Input**: User description: "Vamos adicionar a feature de quantidade de participantes seja personalizada e também uma imagem personalizada para a imagem do grupo e também crie um footer como a do whatsapp com input do texto e botao de envio, igualmente a dowhatsapp"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Custom Group Image Configuration (Priority: P1)

Admin configures a custom group image that appears as the WhatsApp group profile picture in the transition page header, creating a branded or themed visual identity for each WhatsApp group landing page.

**Why this priority**: Visual identity is critical for user recognition and trust. Group images are the first thing users notice and directly impact click-through rates.

**Independent Test**: Can be fully tested by uploading a group image via the admin panel and verifying it displays correctly on the WhatsApp transition page (/w/[slug]) as the circular header image.

**Acceptance Scenarios**:

1. **Given** admin is editing a WhatsApp page in `/parametrizacao/whatsapp`, **When** they upload a custom group image, **Then** the image appears as the circular header profile picture on the transition page
2. **Given** admin uploads a new group image, **When** a user visits the transition page, **Then** the new custom image displays instead of the previous one
3. **Given** admin removes the group image, **When** the page is saved, **Then** no circular header image displays on the transition page
4. **Given** admin uploads an invalid image format, **When** they attempt to save, **Then** a validation error displays explaining accepted formats

---

### User Story 2 - Custom Participant Count Field (Priority: P1)

Admin customizes the displayed participant count for each WhatsApp group page, allowing flexibility to show actual group size, target capacity, or marketing numbers independent of the existing vacancy counter.

**Why this priority**: Participant count is a primary social proof element. Different groups may have different sizes, and admins need control over this number for accuracy and marketing effectiveness.

**Independent Test**: Can be fully tested by setting a specific participant count in the admin panel (e.g., "247 participants") and verifying it displays correctly on the transition page independently from the vacancy counter.

**Acceptance Scenarios**:

1. **Given** admin is creating a new WhatsApp page, **When** they set the participant count to "150", **Then** the page displays "150 participantes" to visitors
2. **Given** admin edits an existing page, **When** they change the participant count from "100" to "250", **Then** the updated count displays immediately on the page
3. **Given** admin leaves the participant count field empty, **When** they save the page, **Then** no participant count displays on the transition page
4. **Given** the vacancy counter is also enabled, **When** both features are active, **Then** both display independently without interfering with each other

---

### User Story 3 - WhatsApp-Style Interactive Footer (Priority: P2)

Visitors see a WhatsApp-style footer at the bottom of the transition page with a text input field and send button, mimicking the familiar WhatsApp interface to create a sense of authenticity and encourage interaction.

**Why this priority**: While valuable for user engagement and interface familiarity, this is decorative/UX enhancement rather than core conversion functionality. The main CTA button already handles the primary action.

**Independent Test**: Can be fully tested by visiting any WhatsApp transition page and verifying a WhatsApp-style footer appears with a text input placeholder and send button icon, matching WhatsApp's visual design.

**Acceptance Scenarios**:

1. **Given** a user visits a WhatsApp transition page, **When** they scroll to the bottom, **Then** they see a footer with a WhatsApp-style text input and send button icon
2. **Given** the footer is displayed, **When** a user clicks the text input, **Then** the input receives focus with appropriate visual feedback
3. **Given** the footer is displayed, **When** a user clicks the send button, **Then** the action triggers the same WhatsApp redirect as the main CTA button
4. **Given** the footer is displayed on mobile, **When** the page loads, **Then** the footer remains fixed at the bottom and doesn't interfere with the main content

---

### Edge Cases

- What happens when an admin uploads an extremely large image file (>10MB)?
- What happens when an admin uploads an image with unusual aspect ratios (e.g., very wide or very tall)?
- What happens when participant count is set to zero or negative numbers?
- What happens when participant count exceeds realistic numbers (e.g., 999,999)?
- How does the footer behave on very small mobile screens (<320px width)?
- What happens when the footer input receives extremely long text (>500 characters)?
- How does the layout handle pages with all features enabled simultaneously (group image + participant count + vacancy counter + footer)?
- What happens if custom footer text conflicts with the fixed footer design?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow admins to upload and store a custom group image for each WhatsApp page
- **FR-002**: System MUST display the custom group image as a circular profile picture in the page header
- **FR-003**: System MUST validate uploaded images for acceptable formats (JPEG, PNG, WebP, GIF)
- **FR-004**: System MUST enforce maximum file size limits for group images
- **FR-005**: System MUST allow admins to configure a custom participant count as an integer value
- **FR-006**: System MUST display the participant count with appropriate labels (e.g., "X participantes")
- **FR-007**: System MUST allow participant count field to be optional (can be left empty)
- **FR-008**: System MUST display participant count independently from the vacancy counter feature
- **FR-009**: System MUST render a WhatsApp-style footer at the bottom of transition pages
- **FR-010**: System MUST include a text input field in the footer with placeholder text
- **FR-011**: System MUST include a send button icon in the footer matching WhatsApp's visual style
- **FR-012**: System MUST trigger WhatsApp redirect when footer send button is clicked
- **FR-013**: System MUST make the footer input field interactive (focusable and clickable)
- **FR-014**: System MUST ensure footer remains fixed at the bottom on mobile devices
- **FR-015**: System MUST preserve existing headerImageUrl functionality while adding group image capability
- **FR-016**: System MUST maintain backward compatibility with pages that don't have these new fields configured

### Key Entities

- **WhatsAppPageRecord**: Extended with new fields
  - `groupImageUrl` (string, optional): URL to the custom group profile image
  - `participantCount` (number, optional): Custom participant count to display
  - Note: These fields are separate from `headerImageUrl` and `vacancyCount`

- **WhatsAppFooter**: New UI component
  - Contains text input field with placeholder
  - Contains send button icon
  - Triggers WhatsApp redirect on interaction
  - Fixed positioning at bottom of viewport

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can upload and configure a custom group image in under 30 seconds
- **SC-002**: Custom group images display correctly across all device sizes (mobile, tablet, desktop)
- **SC-003**: Participant count updates reflect immediately on the transition page without page refresh delays exceeding 2 seconds
- **SC-004**: Footer displays consistently across 95% of modern browsers (Chrome, Safari, Firefox, Edge - last 2 versions)
- **SC-005**: Footer interaction (button click) successfully redirects to WhatsApp with the same reliability as the main CTA button (99%+ success rate)
- **SC-006**: Page load time does not increase by more than 200ms when all customization features are enabled
- **SC-007**: Image upload success rate exceeds 95% for standard formats under the file size limit
- **SC-008**: Admin configuration interface maintains usability with form completion time under 3 minutes for all customization options

## Assumptions

- Custom group image will use similar storage and URL patterns as the existing `headerImageUrl` feature
- Image hosting/storage infrastructure is already in place and can handle additional uploads
- Participant count is a display-only field and does not need to track or validate against actual WhatsApp group membership
- Footer is primarily a visual/UX element and does not need to support actual text message functionality
- Footer send button will reuse the existing WhatsApp redirect logic (same as main CTA button)
- The feature will be added to the existing admin panel at `/parametrizacao/whatsapp`
- Mobile-first responsive design patterns are already established in the codebase
- Maximum image file size limit will follow existing image upload constraints in the system
