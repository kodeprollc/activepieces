import { createAction, Property } from "@activepieces/pieces-framework";
import { housecallProAuth, makeHousecallProRequest } from "../common";
import { HttpMethod } from "@activepieces/pieces-common";

export const getJobs = createAction({
  auth: housecallProAuth,
  name: 'get_jobs',
  displayName: 'Get Jobs',
  description: 'Retrieve a list of jobs from Housecall Pro with full filtering support.',
  props: {
    // Pagination
    page: Property.Number({
      displayName: 'Page',
      description: 'The paginated page number',
      required: false,
      defaultValue: 1,
    }),
    page_size: Property.Number({
      displayName: 'Page Size',
      description: 'The number of jobs returned per page (max 100)',
      required: false,
      defaultValue: 10,
    }),
    // Text search
    q: Property.ShortText({
      displayName: 'Search Query',
      description: 'Search jobs by keyword (customer name, address, description, etc.)',
      required: false,
    }),
    // ID filters
    customer_id: Property.ShortText({
      displayName: 'Customer ID',
      description: 'Filter jobs by a single customer ID',
      required: false,
    }),
    employee_ids: Property.Array({
      displayName: 'Employee IDs',
      description: 'Filter jobs by assigned employee IDs',
      required: false,
    }),
    location_ids: Property.Array({
      displayName: 'Location IDs',
      description: 'Filter jobs by location IDs',
      required: false,
    }),
    // Status filters
    work_status: Property.StaticMultiSelectDropdown({
      displayName: 'Work Status',
      description: 'Filter jobs by work status. Leave empty to return all statuses.',
      required: false,
      options: {
        options: [
          { label: 'Unscheduled', value: 'unscheduled' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Completed', value: 'completed' },
          { label: 'Canceled', value: 'canceled' },
        ],
      },
    }),
    invoice_number: Property.ShortText({
      displayName: 'Invoice Number',
      description: 'Filter by a specific invoice number',
      required: false,
    }),
    lead_source: Property.ShortText({
      displayName: 'Lead Source',
      description: 'Filter jobs by their lead source',
      required: false,
    }),
    // Scheduled date filters
    scheduled_start_min: Property.DateTime({
      displayName: 'Scheduled Start (From)',
      description: 'Return jobs with a scheduled start at or after this date',
      required: false,
    }),
    scheduled_start_max: Property.DateTime({
      displayName: 'Scheduled Start (To)',
      description: 'Return jobs with a scheduled start at or before this date',
      required: false,
    }),
    scheduled_end_min: Property.DateTime({
      displayName: 'Scheduled End (From)',
      description: 'Return jobs with a scheduled end at or after this date',
      required: false,
    }),
    scheduled_end_max: Property.DateTime({
      displayName: 'Scheduled End (To)',
      description: 'Return jobs with a scheduled end at or before this date',
      required: false,
    }),
    // Created/updated date filters
    created_at_min: Property.DateTime({
      displayName: 'Created At (From)',
      description: 'Return jobs created at or after this date',
      required: false,
    }),
    created_at_max: Property.DateTime({
      displayName: 'Created At (To)',
      description: 'Return jobs created at or before this date',
      required: false,
    }),
    updated_at_min: Property.DateTime({
      displayName: 'Updated At (From)',
      description: 'Return jobs updated at or after this date',
      required: false,
    }),
    updated_at_max: Property.DateTime({
      displayName: 'Updated At (To)',
      description: 'Return jobs updated at or before this date',
      required: false,
    }),
    // Expand
    expand: Property.StaticMultiSelectDropdown({
      displayName: 'Expand',
      description: 'Include additional related data in the response',
      required: false,
      options: {
        options: [
          { label: 'Attachments', value: 'attachments' },
          { label: 'Appointments', value: 'appointments' },
          { label: 'Assigned Employees', value: 'assigned_employees' },
          { label: 'Customer', value: 'customer' },
          { label: 'Address', value: 'address' },
          { label: 'Line Items', value: 'line_items' },
        ],
      },
    }),
    // Sorting
    sort_by: Property.StaticDropdown({
      displayName: 'Sort By',
      description: 'The field to sort results by',
      required: false,
      options: {
        options: [
          { label: 'Created At', value: 'created_at' },
          { label: 'Updated At', value: 'updated_at' },
          { label: 'Invoice Number', value: 'invoice_number' },
          { label: 'ID', value: 'id' },
          { label: 'Description', value: 'description' },
          { label: 'Work Status', value: 'work_status' },
          { label: 'Scheduled Start', value: 'scheduled_start' },
          { label: 'Scheduled End', value: 'scheduled_end' },
        ],
      },
    }),
    sort_direction: Property.StaticDropdown({
      displayName: 'Sort Direction',
      required: false,
      options: {
        options: [
          { label: 'Ascending', value: 'asc' },
          { label: 'Descending', value: 'desc' },
        ],
      },
      defaultValue: 'desc',
    }),
  },

  async run({ auth, propsValue }) {
    const queryParams: Record<string, string | string[]> = {};

    if (propsValue.page) queryParams['page'] = String(propsValue.page);
    if (propsValue.page_size) queryParams['page_size'] = String(propsValue.page_size);
    if (propsValue.q) queryParams['q'] = propsValue.q;
    if (propsValue.customer_id) queryParams['customer_id'] = propsValue.customer_id;
    if (propsValue.invoice_number) queryParams['invoice_number'] = propsValue.invoice_number;
    if (propsValue.lead_source) queryParams['lead_source'] = propsValue.lead_source;

    if (propsValue.employee_ids?.length) queryParams['employee_ids'] = propsValue.employee_ids as string[];
    if (propsValue.location_ids?.length) queryParams['location_ids'] = propsValue.location_ids as string[];
    if (propsValue.work_status?.length) queryParams['work_status'] = propsValue.work_status;
    if (propsValue.expand?.length) queryParams['expand'] = propsValue.expand;

    if (propsValue.scheduled_start_min) queryParams['scheduled_start_min'] = propsValue.scheduled_start_min;
    if (propsValue.scheduled_start_max) queryParams['scheduled_start_max'] = propsValue.scheduled_start_max;
    if (propsValue.scheduled_end_min) queryParams['scheduled_end_min'] = propsValue.scheduled_end_min;
    if (propsValue.scheduled_end_max) queryParams['scheduled_end_max'] = propsValue.scheduled_end_max;
    if (propsValue.created_at_min) queryParams['created_at_min'] = propsValue.created_at_min;
    if (propsValue.created_at_max) queryParams['created_at_max'] = propsValue.created_at_max;
    if (propsValue.updated_at_min) queryParams['updated_at_min'] = propsValue.updated_at_min;
    if (propsValue.updated_at_max) queryParams['updated_at_max'] = propsValue.updated_at_max;

    if (propsValue.sort_by) queryParams['sort_by'] = propsValue.sort_by;
    if (propsValue.sort_direction) queryParams['sort_direction'] = propsValue.sort_direction;

    const response = await makeHousecallProRequest(
      auth,
      '/jobs',
      HttpMethod.GET,
      undefined,
      queryParams
    );

    return response.body;
  },
});
