<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="modelValue" class="drawer-backdrop" @click="$emit('update:modelValue', false)" />
    </Transition>

    <Transition name="drawer">
      <div
        v-if="modelValue"
        class="drawer-panel"
        :class="{
          'drawer-panel--wide': type === 'New Unit' && unitMode === 'ai' && aiStage === 'preview',
        }"
        role="dialog"
        :aria-label="title"
      >
        <div class="drawer-header">
          <div class="drawer-title-group">
            <div class="drawer-icon" v-html="icon" />
            <div>
              <p class="drawer-label">{{ label }}</p>
              <h2 class="drawer-title">{{ title }}</h2>
            </div>
          </div>
          <button
            class="drawer-close"
            @click="$emit('update:modelValue', false)"
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="drawer-body">
          <template v-if="type === 'New Property' || type === 'Edit Property'">
            <div v-if="submitSuccess" class="success-state">
              <div class="success-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p class="success-title">
                {{ type === 'Edit Property' ? 'Changes Saved' : 'Property Created' }}
              </p>
              <p class="success-sub">
                <strong>{{ propertyForm.name }}</strong> has been
                {{ type === 'Edit Property' ? 'updated' : 'added' }} successfully.
              </p>
            </div>

            <template v-else>
              <div v-if="submitError" class="error-banner">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ submitError }}
              </div>

              <div class="form-section">
                <p class="section-label">Property Details</p>
                <div class="form-group">
                  <label>Property Name <span class="required">*</span></label>
                  <input
                    v-model="propertyForm.name"
                    type="text"
                    placeholder="e.g. Sunset Apartments"
                    :class="{ 'input-error': propertyFormErrors.name }"
                  />
                  <span v-if="propertyFormErrors.name" class="field-error">{{
                    propertyFormErrors.name
                  }}</span>
                </div>
                <div class="form-group">
                  <label>Property Type <span class="required">*</span></label>
                  <select
                    v-model="propertyForm.property_type"
                    :class="{ 'input-error': propertyFormErrors.property_type }"
                  >
                    <option value="">Select type</option>
                    <option value="home">Home</option>
                    <option value="apartment">Apartment Complex</option>
                    <option value="office">Office Space</option>
                    <option value="estate">Estate</option>
                  </select>
                  <span v-if="propertyFormErrors.property_type" class="field-error">{{
                    propertyFormErrors.property_type
                  }}</span>
                </div>
                <div class="form-group">
                  <label>Location</label>
                  <input
                    v-model="propertyForm.location"
                    type="text"
                    placeholder="e.g. Milimani Estate, Nakuru"
                  />
                </div>
              </div>
              <div class="form-section">
                <p class="section-label">Additional Info</p>
                <div class="form-group">
                  <label>Notes</label>
                  <textarea
                    v-model="propertyForm.notes"
                    rows="3"
                    placeholder="Any notes about this property…"
                  />
                </div>
              </div>
            </template>
          </template>

          <template v-else-if="type === 'New Block' || type === 'Edit Block'">
            <div v-if="submitSuccess" class="success-state">
              <div class="success-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p class="success-title">
                {{ type === 'Edit Block' ? 'Changes Saved' : 'Block Created' }}
              </p>
              <p class="success-sub">
                <strong>{{ blockForm.name_or_code }}</strong> has been
                {{ type === 'Edit Block' ? 'updated' : 'added' }} successfully.
              </p>
            </div>

            <template v-else>
              <div v-if="submitError" class="error-banner">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ submitError }}
              </div>

              <div class="form-section">
                <p class="section-label">Block Details</p>

                <div class="form-group">
                  <label>Name / Code <span class="required">*</span></label>
                  <input
                    v-model="blockForm.name_or_code"
                    type="text"
                    placeholder="e.g. Block A, Wing B, North Tower"
                    :class="{ 'input-error': blockFormErrors.name_or_code }"
                  />
                  <span v-if="blockFormErrors.name_or_code" class="field-error">{{
                    blockFormErrors.name_or_code
                  }}</span>
                </div>

                <div class="form-group" v-if="!initialData?.propertyId">
                  <label>Property <span class="required">*</span></label>
                  <select
                    v-model="blockForm.property"
                    :class="{ 'input-error': blockFormErrors.property }"
                    :disabled="propertiesLoading"
                  >
                    <option value="">
                      {{ propertiesLoading ? 'Loading…' : 'Select a property' }}
                    </option>
                    <option v-for="p in properties" :key="p.id" :value="p.id">
                      {{ p.name }}
                    </option>
                  </select>
                  <span v-if="blockFormErrors.property" class="field-error">{{
                    blockFormErrors.property
                  }}</span>
                </div>

                <div class="form-group">
                  <label>Notes</label>
                  <textarea
                    v-model="blockForm.notes"
                    rows="3"
                    placeholder="Any notes about this block…"
                  />
                </div>
              </div>
            </template>
          </template>

          <template v-else-if="type === 'New Unit' || type === 'Edit Unit'">
            <div class="mode-toggle">
              <button
                class="mode-btn"
                :class="{ active: unitMode === 'manual' }"
                @click="switchUnitMode('manual')"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Manual
              </button>
              <button
                class="mode-btn mode-btn--ai"
                :class="{ active: unitMode === 'ai' }"
                @click="switchUnitMode('ai')"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                AI Assist
                <span class="ai-badge">Beta</span>
              </button>
            </div>

            <!-- MANUAL MODE -->
            <template v-if="unitMode === 'manual'">
              <div v-if="submitSuccess" class="success-state">
                <div class="success-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p class="success-title">Unit Created!</p>
                <p class="success-sub">
                  Unit <strong>{{ unitForm.code }}</strong> has been added successfully.
                </p>
              </div>

              <template v-else>
                <div v-if="submitError" class="error-banner">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {{ submitError }}
                </div>

                <div class="form-section">
                  <p class="section-label">Unit Details</p>
                  <div class="form-group" v-if="!initialData?.propertyId">
                    <label>Property <span class="required">*</span></label>
                    <select
                      v-model="unitForm.property"
                      :class="{ 'input-error': unitFormErrors.property }"
                      :disabled="propertiesLoading"
                    >
                      <option value="">
                        {{ propertiesLoading ? 'Loading…' : 'Select a property' }}
                      </option>
                      <option v-for="p in properties" :key="p.id" :value="p.id">
                        {{ p.name }}
                      </option>
                    </select>
                    <span v-if="unitFormErrors.property" class="field-error">{{
                      unitFormErrors.property
                    }}</span>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Block <span class="optional">(optional)</span></label>
                      <select
                        v-model="unitForm.block"
                        :disabled="!unitForm.property || blocksLoading"
                      >
                        <option value="">{{ blocksLoading ? 'Loading…' : 'No block' }}</option>
                        <option v-for="b in unitBlocksList" :key="b.id" :value="b.id">
                          {{ b.name_or_code }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Unit Code <span class="required">*</span></label>
                      <input
                        v-model="unitForm.code"
                        type="text"
                        placeholder="e.g. A1, 101, Room 4"
                        :class="{ 'input-error': unitFormErrors.code }"
                      />
                      <span v-if="unitFormErrors.code" class="field-error">{{
                        unitFormErrors.code
                      }}</span>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Rooms</label>
                      <input v-model="unitForm.rooms" type="number" placeholder="e.g. 2" min="0" />
                    </div>
                    <div class="form-group">
                      <label>Price (KES) <span class="required">*</span></label>
                      <input
                        v-model="unitForm.price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        :class="{ 'input-error': unitFormErrors.price }"
                      />
                      <span v-if="unitFormErrors.price" class="field-error">{{
                        unitFormErrors.price
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <p class="section-label">Condition & Status</p>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Condition</label>
                      <select v-model="unitForm.condition">
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="needs_repair">Needs Repair</option>
                        <option value="uninhabitable">Uninhabitable</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Status</label>
                      <select v-model="unitForm.is_available">
                        <option value="true">Vacant</option>
                        <option value="false">Occupied</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Last Inspection Date</label>
                    <input v-model="unitForm.last_inspection_date" type="date" />
                  </div>
                </div>

                <div class="form-section">
                  <p class="section-label">Notes</p>
                  <div class="form-group">
                    <textarea
                      v-model="unitForm.notes"
                      rows="3"
                      placeholder="Any additional notes about this unit…"
                    />
                  </div>
                </div>
              </template>
            </template>

            <!-- AI ASSIST MODE -->
            <template v-else>
              <template v-if="aiStage === 'chat'">
                <div class="ai-intro">
                  <div class="ai-intro-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="ai-intro-title">AI Bulk Unit Builder</p>
                    <p class="ai-intro-sub">
                      Answer a few questions and I'll generate all your units instantly. You'll get
                      a full preview to review and edit before saving.
                    </p>
                  </div>
                </div>

                <div class="ai-chat" ref="chatEl">
                  <div v-for="(msg, i) in chatMessages" :key="i" class="chat-msg" :class="msg.role">
                    <div v-if="msg.role === 'ai'" class="chat-avatar">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div class="chat-bubble">
                      <p v-html="msg.text" style="margin: 0" />
                      <div v-if="msg.chips && !answeredKeys.has(msg.stepKey)" class="chip-row">
                        <button
                          v-for="chip in msg.chips"
                          :key="typeof chip === 'object' ? chip.value : chip"
                          class="chip"
                          @click="selectChip(chip)"
                        >
                          {{ typeof chip === 'object' ? chip.label : chip }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="isTyping" class="chat-msg ai">
                    <div class="chat-avatar">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div class="chat-bubble typing-bubble">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>

                <div class="ai-input-row" v-if="!allStepsDone">
                  <div class="ai-input-wrap">
                    <input
                      ref="chatInputEl"
                      v-model="userInput"
                      :placeholder="currentPlaceholder"
                      @keydown.enter.prevent="sendMessage"
                      type="text"
                    />
                    <button class="ai-send-btn" @click="sendMessage" :disabled="!userInput.trim()">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                  <p class="ai-input-hint">{{ currentHint }}</p>
                </div>

                <div v-if="allStepsDone" class="ai-generate-wrap">
                  <div class="form-group">
                    <label>
                      Any extra context for the AI? <span class="optional">(optional)</span>
                    </label>
                    <textarea
                      v-model="extraNotes"
                      rows="3"
                      placeholder="e.g. 2 of the units are 1-bedrooms at Ksh 7,500, the rest are bedsitters at Ksh 4,500. Unit 5 is currently occupied."
                    />
                  </div>
                  <button class="btn-generate" @click="generateUnits" :disabled="isGenerating">
                    <template v-if="isGenerating">
                      <span class="spinner"></span> Generating…
                    </template>
                    <template v-else>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      Generate {{ aiAnswers.unitCount || '' }} Units
                    </template>
                  </button>
                </div>
              </template>

              <template v-else-if="aiStage === 'preview'">
                <div class="preview-header">
                  <div class="preview-header-left">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    <span
                      >{{ generatedUnits.length }} units generated — review &amp; edit below</span
                    >
                  </div>
                  <button class="btn-regenerate" @click="resetAiChat">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                    </svg>
                    Start over
                  </button>
                </div>

                <div class="preview-table-wrap">
                  <table class="preview-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Rooms</th>
                        <th>Price (KES)</th>
                        <th>Condition</th>
                        <th>Available</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(unit, idx) in generatedUnits"
                        :key="idx"
                        :class="{ 'row-editing': unit._editing }"
                      >
                        <td class="td-num">{{ idx + 1 }}</td>
                        <td>
                          <input v-if="unit._editing" v-model="unit.code" class="cell-input" />
                          <span v-else>{{ unit.code }}</span>
                        </td>
                        <td>
                          <input
                            v-if="unit._editing"
                            v-model="unit.rooms"
                            type="number"
                            class="cell-input cell-input--sm"
                          />
                          <span v-else>{{ unit.rooms ?? '—' }}</span>
                        </td>
                        <td>
                          <input
                            v-if="unit._editing"
                            v-model="unit.price"
                            type="number"
                            class="cell-input cell-input--sm"
                          />
                          <span v-else>{{ unit.price }}</span>
                        </td>
                        <td>
                          <select v-if="unit._editing" v-model="unit.condition" class="cell-select">
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="needs_repair">Needs Repair</option>
                            <option value="uninhabitable">Uninhabitable</option>
                          </select>
                          <span v-else>{{ unit.condition }}</span>
                        </td>
                        <td>
                          <select
                            v-if="unit._editing"
                            v-model="unit.is_available"
                            class="cell-select"
                          >
                            <option :value="true">Yes</option>
                            <option :value="false">No</option>
                          </select>
                          <span v-else>{{ unit.is_available ? 'Yes' : 'No' }}</span>
                        </td>
                        <td class="td-actions">
                          <button
                            v-if="unit._editing"
                            class="row-action-btn row-action-btn--save"
                            @click="unit._editing = false"
                            title="Done"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>
                          <button
                            v-else
                            class="row-action-btn"
                            @click="unit._editing = true"
                            title="Edit"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            class="row-action-btn row-action-btn--del"
                            @click="generatedUnits.splice(idx, 1)"
                            title="Remove"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button class="btn-add-row" @click="addEmptyUnit">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add row
                </button>
              </template>
            </template>
          </template>

          <template v-else-if="type === 'New Tenant' || type === 'Edit Tenant'">
            <div v-if="submitSuccess" class="success-state">
              <div class="success-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p class="success-title">Tenant Added!</p>
              <p class="success-sub">
                <strong>{{ tenantForm.name }}</strong> has been added successfully.
              </p>
            </div>

            <template v-else>
              <div v-if="submitError" class="error-banner">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ submitError }}
              </div>

              <div class="form-section">
                <p class="section-label">Personal Info</p>
                <div class="form-group">
                  <label>Full Name <span class="required">*</span></label>
                  <input
                    v-model="tenantForm.name"
                    type="text"
                    placeholder="e.g. Jane Mwangi"
                    :class="{ 'input-error': tenantFormErrors.name }"
                  />
                  <span v-if="tenantFormErrors.name" class="field-error">{{
                    tenantFormErrors.name
                  }}</span>
                </div>
                <div class="form-group">
                  <label>ID Number <span class="optional">(optional)</span></label>
                  <input
                    v-model="tenantForm.id_number"
                    type="number"
                    placeholder="e.g. 13987678"
                    :class="{ 'input-error': tenantFormErrors.id_number }"
                  />
                  <span v-if="tenantFormErrors.id_number" class="field-error">{{
                    tenantFormErrors.id_number
                  }}</span>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Phone Number <span class="required">*</span></label>
                    <input
                      v-model="tenantForm.phone_number"
                      type="tel"
                      placeholder="e.g. 0712 345 678"
                      :class="{ 'input-error': tenantFormErrors.phone_number }"
                    />
                    <span v-if="tenantFormErrors.phone_number" class="field-error">{{
                      tenantFormErrors.phone_number
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label>Alt. Phone <span class="optional">(optional)</span></label>
                    <input
                      v-model="tenantForm.alt_phone_number"
                      type="tel"
                      placeholder="e.g. 0798 765 432"
                    />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <p class="section-label">Lease Info</p>
                <div class="form-group">
                  <label>Assign Unit <span class="optional">(optional)</span></label>
                  <select v-model="tenantForm.unit" :disabled="unitsLoading">
                    <option value="">{{ unitsLoading ? 'Loading…' : 'No unit assigned' }}</option>
                    <option v-for="u in tenantUnitsList" :key="u.id" :value="u.id">
                      {{ u.code || u.id }}
                    </option>
                  </select>
                  <span class="field-hint">Only vacant units are shown.</span>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Move-in Date</label>
                    <input v-model="tenantForm.move_in_date" type="date" />
                  </div>
                  <div class="form-group">
                    <label>Move-out Date</label>
                    <input v-model="tenantForm.move_out_date" type="date" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Monthly Due Day</label>
                    <input
                      v-model="tenantForm.monthly_due_day"
                      type="number"
                      placeholder="e.g. 5"
                      min="1"
                      max="31"
                    />
                    <span class="field-hint">Day of month rent is due.</span>
                  </div>
                  <div class="form-group">
                    <label>Status</label>
                    <select v-model="tenantForm.is_active">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <p class="section-label">Notes</p>
                <div class="form-group">
                  <textarea
                    v-model="tenantForm.notes"
                    rows="3"
                    placeholder="Any additional notes about this tenant…"
                  />
                </div>
              </div>
            </template>
          </template>

          <template v-else-if="type === 'New Payment' || type === 'Edit Payment'">
            <div v-if="submitSuccess" class="success-state">
              <div class="success-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p class="success-title">Payment Recorded!</p>
              <p class="success-sub">The payment has been saved successfully.</p>
            </div>

            <template v-else>
              <div v-if="submitError" class="error-banner">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ submitError }}
              </div>

              <div class="form-section">
                <p class="section-label">Payment Details</p>
                <div class="form-row">
                  <div class="form-group">
                    <label>Tenant</label>
                    <select v-model="paymentForm.tenant" :disabled="paymentTenantsLoading">
                      <option value="">
                        {{ paymentTenantsLoading ? 'Loading…' : 'Select tenant' }}
                      </option>
                      <option v-for="t in paymentTenantsList" :key="t.id" :value="t.id">
                        {{ t.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Unit</label>
                    <select v-model="paymentForm.unit" :disabled="paymentUnitsLoading">
                      <option value="">
                        {{ paymentUnitsLoading ? 'Loading…' : 'Select unit' }}
                      </option>
                      <option v-for="u in paymentUnitsList" :key="u.id" :value="u.id">
                        {{ u.code || u.id }}
                      </option>
                    </select>
                    <span class="field-hint">Auto-filled from tenant's assigned unit.</span>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Amount <span class="required">*</span></label>
                    <input
                      v-model="paymentForm.amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      :class="{ 'input-error': paymentFormErrors.amount }"
                    />
                    <span v-if="paymentFormErrors.amount" class="field-error">{{
                      paymentFormErrors.amount
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label>Currency</label>
                    <select disabled>
                      <option value="KES">KES</option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Payment Date <span class="required">*</span></label>
                    <input
                      v-model="paymentForm.payment_date"
                      type="datetime-local"
                      :class="{ 'input-error': paymentFormErrors.payment_date }"
                    />
                    <span v-if="paymentFormErrors.payment_date" class="field-error">{{
                      paymentFormErrors.payment_date
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label>Payment Method</label>
                    <select v-model="paymentForm.payment_method">
                      <option value="mpesa">M-Pesa</option>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Purpose</label>
                    <select v-model="paymentForm.purpose">
                      <option value="rent">Rent</option>
                      <option value="fine">Fine</option>
                      <option value="repairs">Repairs</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Status</label>
                    <select v-model="paymentForm.status">
                      <option value="success">Success</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label>Payment Reference</label>
                  <input
                    v-model="paymentForm.reference"
                    type="text"
                    placeholder="e.g. M-Pesa transaction code"
                  />
                </div>
              </div>

              <div class="form-section">
                <p class="section-label">Notes</p>
                <div class="form-group">
                  <textarea
                    v-model="paymentForm.notes"
                    rows="3"
                    placeholder="Any notes about this payment…"
                  />
                </div>
              </div>
            </template>
          </template>

          <template v-else-if="type === 'New Expense' || type === 'Edit Expense'">
            <div v-if="submitSuccess" class="success-state">
              <div class="success-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p class="success-title">Expense Logged!</p>
              <p class="success-sub">The expense has been saved successfully.</p>
            </div>

            <template v-else>
              <div v-if="submitError" class="error-banner">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ submitError }}
              </div>

              <div class="form-section">
                <p class="section-label">Expense Details</p>

                <div class="form-group">
                  <label>Property <span class="required">*</span></label>
                  <select
                    v-model="expenseForm.property"
                    :disabled="propertiesLoading"
                    :class="{ 'input-error': expenseFormErrors.property }"
                  >
                    <option value="">
                      {{ propertiesLoading ? 'Loading…' : 'Select property' }}
                    </option>
                    <option v-for="p in properties" :key="p.id" :value="p.id">
                      {{ p.name }}
                    </option>
                  </select>
                  <span v-if="expenseFormErrors.property" class="field-error">{{
                    expenseFormErrors.property
                  }}</span>
                </div>

                <div class="form-group">
                  <label>Linked Report <span class="optional">(optional)</span></label>
                  <select
                    v-model="expenseForm.report"
                    :disabled="!expenseForm.property || expenseReportsLoading"
                  >
                    <option value="">
                      {{
                        expenseReportsLoading
                          ? 'Loading…'
                          : !expenseForm.property
                            ? 'Select a property first'
                            : 'None'
                      }}
                    </option>
                    <option v-for="r in expenseReportsList" :key="r.id" :value="r.id">
                      {{ r.title }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Category</label>
                  <select v-model="expenseForm.category">
                    <option value="">Select category</option>
                    <option value="repair">Repair</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="utility">Utility</option>
                    <option value="security">Security</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <input
                    v-model="expenseForm.description"
                    type="text"
                    placeholder="Brief description of the expense"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Amount (KES) <span class="required">*</span></label>
                    <input
                      v-model="expenseForm.amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      :class="{ 'input-error': expenseFormErrors.amount }"
                    />
                    <span v-if="expenseFormErrors.amount" class="field-error">{{
                      expenseFormErrors.amount
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label>Date Incurred <span class="required">*</span></label>
                    <input
                      v-model="expenseForm.date_incurred"
                      type="date"
                      :class="{ 'input-error': expenseFormErrors.date_incurred }"
                    />
                    <span v-if="expenseFormErrors.date_incurred" class="field-error">{{
                      expenseFormErrors.date_incurred
                    }}</span>
                  </div>
                </div>

                <div class="form-group">
                  <label>Attachment</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    @change="expenseForm.attachment = $event.target.files[0]"
                  />
                </div>
              </div>
            </template>
          </template>

          <template v-else-if="type === 'New Report' || type === 'Edit Report'">
            <div v-if="submitSuccess" class="success-state">
              <div class="success-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p class="success-title">
                {{ type === 'Edit Report' ? 'Report Updated' : 'Report Created' }}
              </p>
              <p class="success-sub">
                <strong>{{ reportForm.title }}</strong> has been
                {{ type === 'Edit Report' ? 'updated' : 'logged' }} successfully.
              </p>
            </div>

            <template v-else>
              <div v-if="submitError" class="error-banner">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ submitError }}
              </div>

              <div class="form-section">
                <p class="section-label">Report Details</p>

                <div class="form-group">
                  <label>Title <span class="required">*</span></label>
                  <input
                    v-model="reportForm.title"
                    type="text"
                    placeholder="e.g. Burst pipe in bathroom"
                    :class="{ 'input-error': reportFormErrors.title }"
                  />
                  <span v-if="reportFormErrors.title" class="field-error">{{
                    reportFormErrors.title
                  }}</span>
                </div>

                <div class="form-row">
                  <div class="form-group" v-if="!initialData?.propertyId">
                    <label>Property <span class="required">*</span></label>
                    <select
                      v-model="reportForm.property"
                      :disabled="propertiesLoading"
                      :class="{ 'input-error': reportFormErrors.property }"
                    >
                      <option value="">
                        {{ propertiesLoading ? 'Loading…' : 'Select a property' }}
                      </option>
                      <option v-for="p in properties" :key="p.id" :value="p.id">
                        {{ p.name }}
                      </option>
                    </select>
                    <span v-if="reportFormErrors.property" class="field-error">{{
                      reportFormErrors.property
                    }}</span>
                  </div>

                  <div class="form-group">
                    <label>Unit <span class="optional">(optional)</span></label>
                    <select
                      v-model="reportForm.unit"
                      :disabled="!reportForm.property || reportUnitsLoading"
                    >
                      <option value="">{{ reportUnitsLoading ? 'Loading…' : 'No unit' }}</option>
                      <option v-for="u in reportUnitsList" :key="u.id" :value="u.id">
                        {{ u.code || u.id }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Priority</label>
                    <select v-model="reportForm.priority_level">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Status</label>
                    <select v-model="reportForm.status">
                      <option value="open">Open</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Date &amp; Time Occurred</label>
                  <input v-model="reportForm.occurred_at" type="date" />
                </div>

                <div class="form-group">
                  <label>Description <span class="optional">(optional)</span></label>
                  <textarea
                    v-model="reportForm.incident"
                    rows="3"
                    placeholder="Describe the incident…"
                  />
                </div>
              </div>

              <div class="form-section">
                <p class="section-label">Reporter Info</p>
                <div class="form-row">
                  <div class="form-group">
                    <label>Reporter Name</label>
                    <input v-model="reportForm.reporter_name" type="text" placeholder="Full name" />
                  </div>
                  <div class="form-group">
                    <label>Relationship</label>
                    <input
                      v-model="reportForm.relationship"
                      type="text"
                      placeholder="e.g. Tenant, Neighbour"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Reporter Phone</label>
                  <input
                    v-model="reportForm.reporter_phone"
                    type="tel"
                    placeholder="e.g. 0712 345 678"
                  />
                </div>
              </div>
            </template>
          </template>
        </div>

        <div class="drawer-footer">
          <button
            class="btn-cancel"
            @click="$emit('update:modelValue', false)"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            v-if="
              !(type === 'New Unit' && unitMode === 'ai' && aiStage === 'chat') && !submitSuccess
            "
            class="btn-submit"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            <template v-if="isSubmitting">
              <span class="btn-bubbles"> <span></span><span></span><span></span> </span>
            </template>
            <template v-else>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ footerSubmitLabel }}
            </template>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, reactive, nextTick, watch } from 'vue'
import { apiFetch } from '@/utils/api'

const props = defineProps({
  modelValue: Boolean,
  type: String,
  initialData: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const resetSubmitState = () => {
  isSubmitting.value = false
  submitSuccess.value = false
  submitError.value = ''
}

const extractError = (data) => {
  const firstField = Object.keys(data)[0]
  if (firstField && Array.isArray(data[firstField])) return `${firstField}: ${data[firstField][0]}`
  return data.detail || 'Something went wrong. Please try again.'
}

const properties = ref([])
const propertiesLoading = ref(false)

const fetchProperties = async () => {
  propertiesLoading.value = true
  try {
    const res = await apiFetch('/api/properties/')
    if (res.ok) {
      const data = await res.json()
      properties.value = Array.isArray(data) ? data : (data.results ?? [])
    }
  } finally {
    propertiesLoading.value = false
  }
}

const configs = {
  'New Property': {
    label: 'Properties',
    title: 'New Property',
    submit: 'Create Property',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-6 9 6"/><path d="M9 22V12h6v10"/><path d="M21 22H3"/></svg>`,
  },
  'Edit Property': {
    label: 'Properties',
    title: 'Edit Property',
    submit: 'Save Changes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-6 9 6"/><path d="M9 22V12h6v10"/><path d="M21 22H3"/></svg>`,
  },
  'New Unit': {
    label: 'Units',
    title: 'New Unit',
    submit: 'Create Unit',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
  'Edit Unit': {
    label: 'Units',
    title: 'Edit Unit',
    submit: 'Save Changes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
  'New Block': {
    label: 'Blocks',
    title: 'New Block',
    submit: 'Create Block',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
  },
  'Edit Block': {
    label: 'Blocks',
    title: 'Edit Block',
    submit: 'Save Changes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
  },
  'New Tenant': {
    label: 'Tenants',
    title: 'New Tenant',
    submit: 'Add Tenant',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  'Edit Tenant': {
    label: 'Tenants',
    title: 'Edit Tenant',
    submit: 'Save Changes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  'New Report': {
    label: 'Reports',
    title: 'New Report',
    submit: 'Create Report',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  },
  'Edit Report': {
    label: 'Reports',
    title: 'Edit Report',
    submit: 'Save Changes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  },
  'New Payment': {
    label: 'Finances',
    title: 'New Payment',
    submit: 'Record Payment',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12h-6a2 2 0 0 0 0 4h6v-4Z"/><path d="M2 14V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H6a4 4 0 0 0-4 4Z"/></svg>`,
  },
  'Edit Payment': {
    label: 'Finances',
    title: 'Edit Payment',
    submit: 'Save Changes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12h-6a2 2 0 0 0 0 4h6v-4Z"/><path d="M2 14V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H6a4 4 0 0 0-4 4Z"/></svg>`,
  },
  'New Expense': {
    label: 'Finances',
    title: 'New Expense',
    submit: 'Log Expense',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2V2Z"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>`,
  },
  'Edit Expense': {
    label: 'Finances',
    title: 'Edit Expense',
    submit: 'Save Changes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2V2Z"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>`,
  },
}

const config = computed(() => configs[props.type] || {})
const label = computed(() => config.value.label || '')
const title = computed(() => config.value.title || props.type)
const icon = computed(() => config.value.icon || '')
const submitLabel = computed(() => config.value.submit || 'Submit')

const isEdit = computed(() => props.type?.startsWith('Edit '))

// PROPERTY form
const propertyForm = reactive({ name: '', property_type: '', location: '', notes: '' })
const propertyFormErrors = reactive({})

const resetPropertyForm = () => {
  const d = isEdit.value ? props.initialData || {} : {}
  propertyForm.name = d.name || ''
  propertyForm.property_type = d.property_type || ''
  propertyForm.location = d.location || ''
  propertyForm.notes = d.notes || ''
  Object.keys(propertyFormErrors).forEach((k) => delete propertyFormErrors[k])
}

const validatePropertyForm = () => {
  Object.keys(propertyFormErrors).forEach((k) => delete propertyFormErrors[k])
  if (!propertyForm.name.trim()) propertyFormErrors.name = 'Property name is required.'
  if (!propertyForm.property_type)
    propertyFormErrors.property_type = 'Please select a property type.'
  return Object.keys(propertyFormErrors).length === 0
}

const submitProperty = async () => {
  if (!validatePropertyForm()) return
  isSubmitting.value = true
  submitError.value = ''
  const url = isEdit.value ? `/api/properties/${props.initialData?.id}/` : '/api/properties/'
  const method = isEdit.value ? 'PATCH' : 'POST'
  try {
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: propertyForm.name,
        property_type: propertyForm.property_type,
        location: propertyForm.location || null,
        notes: propertyForm.notes || null,
      }),
    })
    if (!res.ok) {
      submitError.value = extractError(await res.json().catch(() => ({})))
      return
    }
    const saved = await res.json()
    submitSuccess.value = true
    emit('submit', { type: props.type, data: saved })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

// BLOCK form
const blockForm = reactive({ name_or_code: '', notes: '', property: '' })
const blockFormErrors = reactive({})

const resetBlockForm = () => {
  const d = isEdit.value ? props.initialData || {} : {}
  blockForm.name_or_code = d.name_or_code || ''
  blockForm.notes = d.notes || ''
  blockForm.property = props.initialData?.propertyId ?? d.property ?? ''
  Object.keys(blockFormErrors).forEach((k) => delete blockFormErrors[k])
}

const submitBlock = async () => {
  Object.keys(blockFormErrors).forEach((k) => delete blockFormErrors[k])
  if (!blockForm.property) blockFormErrors.property = 'Please select a property.'
  if (!blockForm.name_or_code.trim()) blockFormErrors.name_or_code = 'Name or code is required.'
  if (Object.keys(blockFormErrors).length) return

  isSubmitting.value = true
  submitError.value = ''
  const url = isEdit.value ? `/api/blocks/${props.initialData?.id}/` : '/api/blocks/'
  const method = isEdit.value ? 'PATCH' : 'POST'
  try {
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name_or_code: blockForm.name_or_code,
        notes: blockForm.notes || null,
        property: blockForm.property,
      }),
    })
    if (!res.ok) {
      submitError.value = extractError(await res.json().catch(() => ({})))
      return
    }
    const saved = await res.json()
    submitSuccess.value = true
    emit('submit', { type: props.type, data: saved })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

// UNIT form
const unitMode = ref('manual')
const switchUnitMode = (mode) => {
  unitMode.value = mode
  if (mode === 'ai') {
    fetchProperties()
    resetAiChat()
  }
}

const unitForm = reactive({
  property: '',
  block: '',
  code: '',
  rooms: '',
  price: '',
  condition: 'good',
  is_available: 'true',
  last_inspection_date: '',
  notes: '',
})
const unitFormErrors = reactive({})
const unitBlocksList = ref([])
const blocksLoading = ref(false)

const resetUnitForm = () => {
  const d = isEdit.value ? props.initialData || {} : {}
  unitForm.property = props.initialData?.propertyId ?? d.property ?? ''
  unitForm.block = d.block || ''
  unitForm.code = d.code || ''
  unitForm.rooms = d.rooms ?? ''
  unitForm.price = d.price || ''
  unitForm.condition = d.condition || 'good'
  unitForm.is_available = d.is_available === false ? 'false' : 'true'
  unitForm.last_inspection_date = d.last_inspection_date || ''
  unitForm.notes = d.notes || ''
  Object.keys(unitFormErrors).forEach((k) => delete unitFormErrors[k])
  unitBlocksList.value = []
}

watch(
  () => unitForm.property,
  async (propertyId) => {
    unitForm.block = ''
    unitBlocksList.value = []
    if (!propertyId) return
    blocksLoading.value = true
    try {
      const res = await apiFetch(`/api/blocks/?property=${propertyId}`)
      if (res.ok) {
        const data = await res.json()
        unitBlocksList.value = Array.isArray(data) ? data : (data.results ?? [])
      }
    } finally {
      blocksLoading.value = false
    }
  },
)

const submitUnit = async () => {
  Object.keys(unitFormErrors).forEach((k) => delete unitFormErrors[k])
  if (!unitForm.property) unitFormErrors.property = 'Please select a property.'
  if (!unitForm.code.trim()) unitFormErrors.code = 'Unit code is required.'
  if (!unitForm.price) unitFormErrors.price = 'Price is required.'
  if (Object.keys(unitFormErrors).length) return

  isSubmitting.value = true
  submitError.value = ''
  const url = isEdit.value ? `/api/units/${props.initialData?.id}/` : '/api/units/'
  const method = isEdit.value ? 'PATCH' : 'POST'
  try {
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property: unitForm.property,
        block: unitForm.block || null,
        code: unitForm.code,
        rooms: unitForm.rooms || null,
        price: unitForm.price,
        condition: unitForm.condition,
        is_available: unitForm.is_available === 'true',
        last_inspection_date: unitForm.last_inspection_date || null,
        notes: unitForm.notes || null,
      }),
    })
    if (!res.ok) {
      submitError.value = extractError(await res.json().catch(() => ({})))
      return
    }
    const saved = await res.json()
    submitSuccess.value = true
    emit('submit', { type: props.type, data: saved })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

// TENANT form
const tenantForm = reactive({
  name: '',
  id_number: '',
  phone_number: '',
  alt_phone_number: '',
  unit: '',
  move_in_date: '',
  move_out_date: '',
  monthly_due_day: '',
  is_active: 'true',
  notes: '',
})
const tenantFormErrors = reactive({})
const tenantUnitsList = ref([])
const unitsLoading = ref(false)

const resetTenantForm = () => {
  const d = isEdit.value ? props.initialData || {} : {}
  tenantForm.name = d.name || ''
  tenantForm.id_number = d.id_number || ''
  tenantForm.phone_number = d.phone_number || ''
  tenantForm.alt_phone_number = d.alt_phone_number || ''
  tenantForm.unit = d.unit || props.initialData?.unitId || ''
  tenantForm.move_in_date = d.move_in_date || ''
  tenantForm.move_out_date = d.move_out_date || ''
  tenantForm.monthly_due_day = d.monthly_due_day ?? ''
  tenantForm.is_active = d.is_active === false ? 'false' : 'true'
  tenantForm.notes = d.notes || ''
  Object.keys(tenantFormErrors).forEach((k) => delete tenantFormErrors[k])
  tenantUnitsList.value = []
}

const fetchUnitsForTenant = async () => {
  const propertyId = props.initialData?.propertyId ?? props.initialData?.property ?? null
  unitsLoading.value = true
  try {
    const url = propertyId
      ? `/api/units/?property=${propertyId}&is_available=true`
      : `/api/units/?is_available=true`
    const res = await apiFetch(url)
    if (res.ok) {
      const data = await res.json()
      let list = Array.isArray(data) ? data : (data.results ?? [])
      // When editing, also include the currently assigned unit (it's occupied,
      // so it won't appear in the available list — fetch it separately)
      if (isEdit.value && props.initialData?.unit) {
        const alreadyIn = list.some((u) => u.id === props.initialData.unit)
        if (!alreadyIn) {
          const ur = await apiFetch(`/api/units/${props.initialData.unit}/`)
          if (ur.ok) list = [await ur.json(), ...list]
        }
      }
      tenantUnitsList.value = list
    }
  } finally {
    unitsLoading.value = false
  }
}

const submitTenant = async () => {
  Object.keys(tenantFormErrors).forEach((k) => delete tenantFormErrors[k])
  if (!tenantForm.name.trim()) tenantFormErrors.name = 'Full name is required.'
  if (!tenantForm.phone_number.trim()) tenantFormErrors.phone_number = 'Phone number is required.'
  if (Object.keys(tenantFormErrors).length) return

  isSubmitting.value = true
  submitError.value = ''
  const url = isEdit.value ? `/api/tenants/${props.initialData?.id}/` : '/api/tenants/'
  const method = isEdit.value ? 'PATCH' : 'POST'
  try {
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: tenantForm.name,
        id_number: tenantForm.id_number,
        phone_number: tenantForm.phone_number,
        alt_phone_number: tenantForm.alt_phone_number || null,
        unit: tenantForm.unit || null,
        move_in_date: tenantForm.move_in_date || null,
        move_out_date: tenantForm.move_out_date || null,
        monthly_due_day: tenantForm.monthly_due_day || null,
        is_active: tenantForm.is_active === 'true',
        notes: tenantForm.notes || null,
      }),
    })
    if (!res.ok) {
      submitError.value = extractError(await res.json().catch(() => ({})))
      return
    }
    const saved = await res.json()
    submitSuccess.value = true
    emit('submit', { type: props.type, data: saved })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

// PAYMENT form
const paymentForm = reactive({
  tenant: '',
  unit: '',
  amount: '',
  payment_date: '',
  payment_method: 'mpesa',
  purpose: 'rent',
  status: 'success',
  reference: '',
  notes: '',
})
const paymentFormErrors = reactive({})
const paymentTenantsList = ref([])
const paymentUnitsList = ref([])
const paymentTenantsLoading = ref(false)
const paymentUnitsLoading = ref(false)

const resetPaymentForm = () => {
  const d = isEdit.value ? props.initialData || {} : {}
  paymentForm.tenant = d.tenant || ''
  paymentForm.unit = d.unit || ''
  paymentForm.amount = d.amount || ''
  paymentForm.payment_date = d.payment_date ? d.payment_date.slice(0, 16) : ''
  paymentForm.payment_method = d.payment_method || 'mpesa'
  paymentForm.purpose = d.purpose || 'rent'
  paymentForm.status = d.status || 'success'
  paymentForm.reference = d.reference || ''
  paymentForm.notes = d.notes || ''
  Object.keys(paymentFormErrors).forEach((k) => delete paymentFormErrors[k])
  paymentUnitsList.value = []
}

const fetchTenantsForPayment = async () => {
  paymentTenantsLoading.value = true
  try {
    const res = await apiFetch('/api/tenants/?is_active=true')
    if (res.ok) {
      const data = await res.json()
      paymentTenantsList.value = Array.isArray(data) ? data : (data.results ?? [])
    }
  } finally {
    paymentTenantsLoading.value = false
  }
}

watch(
  () => paymentForm.tenant,
  async (tenantId) => {
    paymentForm.unit = ''
    paymentUnitsList.value = []
    if (!tenantId) return
    const tenant = paymentTenantsList.value.find((t) => t.id === tenantId)
    if (tenant?.unit) {
      paymentUnitsLoading.value = true
      try {
        const res = await apiFetch(`/api/units/${tenant.unit}/`)
        if (res.ok) paymentUnitsList.value = [await res.json()]
        paymentForm.unit = tenant.unit
      } finally {
        paymentUnitsLoading.value = false
      }
    }
  },
)

const submitPayment = async () => {
  Object.keys(paymentFormErrors).forEach((k) => delete paymentFormErrors[k])
  if (!paymentForm.amount) paymentFormErrors.amount = 'Amount is required.'
  if (!paymentForm.payment_date) paymentFormErrors.payment_date = 'Payment date is required.'
  if (Object.keys(paymentFormErrors).length) return

  isSubmitting.value = true
  submitError.value = ''

  const url = isEdit.value ? `/api/payments/${props.initialData?.id}/` : '/api/payments/'
  const method = isEdit.value ? 'PATCH' : 'POST'

  try {
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant: paymentForm.tenant || null,
        unit: paymentForm.unit || null,
        amount: paymentForm.amount,
        payment_date: paymentForm.payment_date,
        payment_method: paymentForm.payment_method,
        purpose: paymentForm.purpose,
        status: paymentForm.status,
        payment_ref: paymentForm.reference || null,
        notes: paymentForm.notes || null,
      }),
    })
    if (!res.ok) {
      submitError.value = extractError(await res.json().catch(() => ({})))
      return
    }
    const saved = await res.json()
    submitSuccess.value = true
    emit('submit', { type: props.type, data: saved })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

// EXPENSE form
const expenseForm = reactive({
  property: '',
  report: '',
  category: '',
  description: '',
  amount: '',
  date_incurred: '',
  attachment: null,
})
const expenseFormErrors = reactive({})
const expenseReportsList = ref([])
const expenseReportsLoading = ref(false)

const resetExpenseForm = () => {
  const d = isEdit.value ? props.initialData || {} : {}
  expenseForm.property = d.property || ''
  expenseForm.report = d.report || ''
  expenseForm.category = d.category || ''
  expenseForm.description = d.description || ''
  expenseForm.amount = d.amount || ''
  expenseForm.date_incurred = d.date_incurred || ''
  expenseForm.attachment = null
  Object.keys(expenseFormErrors).forEach((k) => delete expenseFormErrors[k])
  expenseReportsList.value = []
}

watch(
  () => expenseForm.property,
  async (propertyId) => {
    expenseForm.report = ''
    expenseReportsList.value = []
    if (!propertyId) return
    expenseReportsLoading.value = true
    try {
      const res = await apiFetch(`/api/reports/?property=${propertyId}`)
      if (res.ok) {
        const data = await res.json()
        expenseReportsList.value = Array.isArray(data) ? data : (data.results ?? [])
      }
    } finally {
      expenseReportsLoading.value = false
    }
  },
)

const submitExpense = async () => {
  const url = isEdit.value ? `/api/expenses/${props.initialData?.id}/` : '/api/expenses/'
  const method = isEdit.value ? 'PATCH' : 'POST'

  Object.keys(expenseFormErrors).forEach((k) => delete expenseFormErrors[k])
  if (!expenseForm.property) expenseFormErrors.property = 'Please select a property.'
  if (!expenseForm.amount) expenseFormErrors.amount = 'Amount is required.'
  if (!expenseForm.date_incurred) expenseFormErrors.date_incurred = 'Date is required.'
  if (Object.keys(expenseFormErrors).length) return

  isSubmitting.value = true
  submitError.value = ''
  try {
    const fd = new FormData()
    fd.append('property', expenseForm.property)
    if (expenseForm.report) fd.append('report', expenseForm.report)
    if (expenseForm.category) fd.append('category', expenseForm.category)
    if (expenseForm.description) fd.append('description', expenseForm.description)
    fd.append('amount', expenseForm.amount)
    fd.append('date_incurred', expenseForm.date_incurred)
    if (expenseForm.attachment) fd.append('attachment', expenseForm.attachment)

    const res = await apiFetch(url, { method, body: fd })
    if (!res.ok) {
      submitError.value = extractError(await res.json().catch(() => ({})))
      return
    }
    const saved = await res.json()
    submitSuccess.value = true
    emit('submit', { type: props.type, data: saved })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

// REPORT form
const reportForm = reactive({
  title: '',
  property: '',
  unit: '',
  priority_level: 'medium',
  status: 'open',
  occurred_at: '',
  incident: '',
  reporter_name: '',
  relationship: '',
  reporter_phone: '',
})
const reportFormErrors = reactive({})
const reportUnitsList = ref([])
const reportUnitsLoading = ref(false)

const resetReportForm = () => {
  reportForm.title = ''
  reportForm.property = props.initialData?.propertyId ?? ''
  reportForm.unit = ''
  reportForm.priority_level = 'medium'
  reportForm.status = 'open'
  reportForm.occurred_at = ''
  reportForm.incident = ''
  reportForm.reporter_name = ''
  reportForm.relationship = ''
  reportForm.reporter_phone = ''
  Object.keys(reportFormErrors).forEach((k) => delete reportFormErrors[k])
  reportUnitsList.value = []
}

watch(
  () => reportForm.property,
  async (propertyId) => {
    reportForm.unit = ''
    reportUnitsList.value = []
    if (!propertyId) return
    reportUnitsLoading.value = true
    try {
      const res = await apiFetch(`/api/units/?property=${propertyId}`)
      if (res.ok) {
        const data = await res.json()
        reportUnitsList.value = Array.isArray(data) ? data : (data.results ?? [])
      }
    } finally {
      reportUnitsLoading.value = false
    }
  },
)

const submitReport = async () => {
  Object.keys(reportFormErrors).forEach((k) => delete reportFormErrors[k])
  if (!reportForm.title.trim()) reportFormErrors.title = 'Title is required.'
  if (!reportForm.property) reportFormErrors.property = 'Please select a property.'
  if (Object.keys(reportFormErrors).length) return

  isSubmitting.value = true
  submitError.value = ''

  const isEdit = props.type === 'Edit Report'
  const url = isEdit ? `/api/reports/${props.initialData?.id}/` : '/api/reports/'
  const method = isEdit ? 'PATCH' : 'POST'

  try {
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: reportForm.title,
        property: reportForm.property,
        unit: reportForm.unit || null,
        priority_level: reportForm.priority_level,
        status: reportForm.status,
        occurred_at: reportForm.occurred_at || null,
        incident: reportForm.incident || null,
        reporter_name: reportForm.reporter_name || null,
        relationship: reportForm.relationship || null,
        reporter_phone: reportForm.reporter_phone || null,
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const firstField = Object.keys(data)[0]
      submitError.value =
        firstField && Array.isArray(data[firstField])
          ? `${firstField}: ${data[firstField][0]}`
          : data.detail || 'Something went wrong.'
      return
    }
    const saved = await res.json()
    submitSuccess.value = true
    emit('submit', { type: props.type, data: saved })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

const aiStage = ref('chat')
const chatMessages = ref([])
const userInput = ref('')
const isTyping = ref(false)
const isGenerating = ref(false)
const extraNotes = ref('')
const currentStep = ref(0)
const aiAnswers = ref({})
const chatEl = ref(null)
const chatInputEl = ref(null)
const generatedUnits = ref([])

const steps = computed(() => [
  {
    question: 'Which <strong>property</strong> are these units for?',
    chips: properties.value.map((p) => ({ label: p.name, value: p.id })),
    key: 'property',
    placeholder: propertiesLoading.value ? 'Loading properties…' : 'Type or select a property…',
  },
  {
    question: 'How <strong>many units</strong> do you want to create?',
    key: 'unitCount',
    placeholder: 'e.g. 15',
    hint: 'Enter a whole number',
  },
  {
    question: 'What <strong>naming scheme</strong> should the units follow?',
    chips: ['101, 102, 103…', 'A1, A2, A3…', 'Room 1, Room 2…', 'Unit 1, Unit 2…'],
    key: 'namingScheme',
    placeholder: 'e.g. 101 or A1 or Room 1…',
    hint: 'Pick a chip or describe your own pattern',
  },
  {
    question: 'What is the <strong>monthly rent</strong> per unit (KES)?',
    key: 'rent',
    placeholder: 'e.g. 4,500',
    hint: 'Applied uniformly — you can adjust per-unit in the preview',
  },
])

const currentPlaceholder = computed(() => steps.value[currentStep.value]?.placeholder || '')
const currentHint = computed(() => steps.value[currentStep.value]?.hint || '')
const allStepsDone = computed(() => currentStep.value >= steps.value.length)
const answeredKeys = ref(new Set())
const generateError = ref(null)

const resetAiChat = () => {
  aiStage.value = 'chat'
  chatMessages.value = []
  userInput.value = ''
  currentStep.value = 0
  aiAnswers.value = {}
  extraNotes.value = ''
  generatedUnits.value = []
  isTyping.value = false
  isGenerating.value = false
  nextTick(() => pushAiMessage(0))
}

const pushAiMessage = async (stepIdx) => {
  if (stepIdx >= steps.value.length) return
  isTyping.value = true
  await delay(550)
  isTyping.value = false
  chatMessages.value.push({
    role: 'ai',
    text: steps.value[stepIdx].question,
    chips: steps.value[stepIdx].chips,
    stepKey: steps.value[stepIdx].key,
  })
  scrollChat()
  await nextTick()
  chatInputEl.value?.focus()
}

const sendMessage = async () => {
  const val = userInput.value.trim()
  if (!val) return
  addUserMessage(val)
}
const selectChip = (chip) => addUserMessage(chip)

const addUserMessage = async (val) => {
  const displayVal = typeof val === 'object' ? val.label : val
  const key = steps.value[currentStep.value].key

  chatMessages.value.push({ role: 'user', text: displayVal })
  aiAnswers.value[key] = typeof val === 'object' ? val.label : val
  answeredKeys.value.add(key)

  if (key === 'property' && typeof val === 'object') {
    aiAnswers.value.propertyId = val.value
  }

  userInput.value = ''
  currentStep.value++
  scrollChat()

  if (currentStep.value < steps.value.length) {
    await pushAiMessage(currentStep.value)
  } else {
    isTyping.value = true
    await delay(650)
    isTyping.value = false
    chatMessages.value.push({
      role: 'ai',
      text: `Perfect! I have everything I need. Add any extra notes below, then hit <strong>Generate</strong> to preview your units.`,
    })
    scrollChat()
  }
}

const generateUnits = async () => {
  isGenerating.value = true
  generateError.value = null

  try {
    const res = await apiFetch('/api/units/ai-generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: aiAnswers.value,
        extra_notes: extraNotes.value,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      generateError.value = body.detail || 'Generation failed. Please try again.'
      return
    }

    const data = await res.json()
    generatedUnits.value = data.units.map((u) => ({ ...u, _editing: false }))
    aiStage.value = 'preview'
  } catch {
    generateError.value = 'Network error. Please check your connection.'
  } finally {
    isGenerating.value = false
  }
}

const publishUnits = async () => {
  isSubmitting.value = true
  submitError.value = ''

  try {
    const res = await apiFetch('/api/units/bulk-create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: aiAnswers.value.propertyId,
        units: generatedUnits.value.map(({ _editing, ...u }) => u),
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      submitError.value = body.detail || 'Failed to save units.'
      return
    }

    const data = await res.json()
    submitSuccess.value = true
    emit('submit', { type: 'bulk', count: data.created })
    setTimeout(() => emit('update:modelValue', false), 1800)
  } catch {
    submitError.value = 'Something went wrong. Please check your connection.'
  } finally {
    isSubmitting.value = false
  }
}

const buildUnitNumber = (scheme, index, floor) => {
  const s = scheme.toLowerCase()
  if (s.includes('a1') || s.includes('a-1'))
    return `${String.fromCharCode(65 + Math.floor(index / 9))}${(index % 9) + 1}`
  if (s.includes('room')) return `Room ${index + 1}`
  if (s.includes('unit')) return `Unit ${index + 1}`
  return `${floor}${String((index % 9) + 1).padStart(2, '0')}`
}

const parseSizeRange = (val) => {
  const clean = val.replace('–', '-')
  if (clean.includes('-')) {
    const parts = clean
      .split('-')
      .map((v) => parseFloat(v.trim()))
      .filter(Boolean)
    if (parts.length === 2) return Math.round((parts[0] + parts[1]) / 2)
  }
  return parseFloat(val) || 350
}

const parseBedrooms = (val, index) => {
  const v = val.toLowerCase()
  if (v.includes('studio')) return 'Studio'
  if (v.includes('mixed') || v.includes('1 &') || v.includes('1 and'))
    return index % 2 === 0 ? '1' : '2'
  const match = val.match(/\d+/)
  return match ? match[0] : '1'
}

const addEmptyUnit = () =>
  generatedUnits.value.push({
    number: '',
    floor: 1,
    bedrooms: '1',
    bathrooms: '1',
    size: '',
    rent: '',
    status: 'Vacant',
    _editing: true,
  })

const statusClass = (status) => ({
  'pill-vacant': status === 'Vacant',
  'pill-occupied': status === 'Occupied',
  'pill-maintenance': status === 'Under Maintenance',
  'pill-reserved': status === 'Reserved',
})

const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const scrollChat = () =>
  nextTick(() => {
    if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  })

const footerSubmitLabel = computed(() => {
  if (props.type === 'New Unit' && unitMode.value === 'ai' && aiStage.value === 'preview')
    return `Publish ${generatedUnits.value.length} Units`
  return submitLabel.value
})

watch([() => props.modelValue, () => props.type], ([val]) => {
  if (!val) return
  resetSubmitState()
  const t = props.type
  if (t === 'New Property' || t === 'Edit Property') resetPropertyForm()
  if (t === 'New Block' || t === 'Edit Block') {
    resetBlockForm()
    if (!props.initialData?.propertyId) fetchProperties()
  }
  if (t === 'New Unit' || t === 'Edit Unit') {
    unitMode.value = 'manual'
    resetUnitForm()
    if (!props.initialData?.propertyId) fetchProperties()
  }
  if (t === 'New Tenant' || t === 'Edit Tenant') {
    resetTenantForm()
    fetchUnitsForTenant()
  }
  if (t === 'New Payment' || t === 'Edit Payment') {
    resetPaymentForm()
    fetchTenantsForPayment()
  }
  if (t === 'New Expense' || t === 'Edit Expense') {
    resetExpenseForm()
    fetchProperties()
  }
  if (props.type === 'New Report' || props.type === 'Edit Report') {
    resetReportForm()
    if (!props.initialData?.propertyId) {
      fetchProperties()
    }
    if (props.type === 'Edit Report') {
      const d = props.initialData || {}
      reportForm.title = d.title || ''
      reportForm.property = d.property || ''
      reportForm.unit = d.unit || ''
      reportForm.priority_level = d.priority_level || 'medium'
      reportForm.status = d.status || 'open'
      reportForm.occurred_at = d.occurred_at ? d.occurred_at.slice(0, 16) : ''
      reportForm.incident = d.incident || ''
      reportForm.reporter_name = d.reporter_name || ''
      reportForm.relationship = d.relationship || ''
      reportForm.reporter_phone = d.reporter_phone || ''
    }
  }
})

const handleSubmit = () => {
  const t = props.type
  if (t === 'New Property' || t === 'Edit Property') return submitProperty()
  if (t === 'New Block' || t === 'Edit Block') return submitBlock()
  if (t === 'New Tenant' || t === 'Edit Tenant') return submitTenant()
  if (t === 'New Payment' || t === 'Edit Payment') return submitPayment()
  if (t === 'New Expense') return submitExpense()
  if (props.type === 'New Report' || props.type === 'Edit Report') {
    submitReport()
    return
  }
  if (t === 'New Unit' || t === 'Edit Unit') {
    if (unitMode.value === 'manual') return submitUnit()
    if (aiStage.value === 'preview') {
      emit('submit', { type: t, units: generatedUnits.value })
      emit('update:modelValue', false)
    }
    return
  }
  emit('update:modelValue', false)
}
</script>

<style scoped src="../styles/drawerpanel.css"></style>
