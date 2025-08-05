"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// Define schemas for dynamic arrays
const genderDistributionSchema = z.object({
  gender: z.string().min(1, { message: "Gender is required!" }),
  distribution: z.number().min(0).max(100, { message: "Distribution must be between 0-100!" }),
});

const ageDistributionSchema = z.object({
  age: z.string().min(1, { message: "Age range is required!" }),
  value: z.number().min(0).max(100, { message: "Value must be between 0-100!" }),
});

const audienceByCountrySchema = z.object({
  category: z.literal("country"),
  name: z.string().min(1, { message: "Country name is required!" }),
  value: z.number().min(0).max(100, { message: "Value must be between 0-100!" }),
});

const collaborationChargesSchema = z.object({
  reel: z.number().min(0, { message: "Reel charge must be positive!" }),
  story: z.number().min(0, { message: "Story charge must be positive!" }),
  post: z.number().min(0, { message: "Post charge must be positive!" }),
  oneMonthDigitalRights: z.number().min(0, { message: "Digital rights charge must be positive!" }),
});

const platformDataSchema = z.object({
  followers: z.number().min(0, { message: "Followers must be positive!" }),
  genderDistribution: z.array(genderDistributionSchema).min(1, { message: "At least one gender distribution is required!" }),
  ageDistribution: z.array(ageDistributionSchema).min(1, { message: "At least one age distribution is required!" }),
  audienceByCountry: z.array(audienceByCountrySchema).min(1, { message: "At least one country is required!" }),
  collaborationCharges: collaborationChargesSchema,
});

const schema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  categoryInstagram: z.string().min(1, { message: "Instagram category is required!" }),
  categoryYouTube: z.string().min(1, { message: "YouTube category is required!" }),
  user_name: z.string().min(1, { message: "Username is required!" }),
  city: z.string().min(1, { message: "City is required!" }),
  state: z.string().min(1, { message: "State is required!" }),
  language: z.string().min(1, { message: "Language is required!" }),
  gender: z.enum(["Male", "Female"], { message: "Gender is required!" }),
  
  instagramData: platformDataSchema,
  youtubeData: platformDataSchema.extend({
    link: z.string().url({ message: "Valid YouTube URL is required!" }),
  }),
  
  averageLikes: z.number().min(0, { message: "Average likes must be positive!" }),
  averageViews: z.number().min(0, { message: "Average views must be positive!" }),
  averageComments: z.number().min(0, { message: "Average comments must be positive!" }),
  averageEngagement: z.number().min(0, { message: "Average engagement must be positive!" }),
  image: z.string().url({ message: "Valid image URL is required!" }),
});

type Inputs = z.infer<typeof schema>;

// InputField component
const InputField = ({ label, name, type = "text", register, error, defaultValue = "", inputProps = {} }) => (
  <div className="flex flex-col gap-2 w-full md:w-1/4">
    <label className="text-xs text-gray-500">{label}</label>
    <input
      type={type}
      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
      {...register(name, { valueAsNumber: type === "number" })}
      {...inputProps}
    />
    {error?.message && (
      <p className="text-xs text-red-400">{error.message.toString()}</p>
    )}
  </div>
);

// Dynamic section component for arrays
const DynamicSection = ({ title, fields, onAdd, onRemove, register, errors, renderFields }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
      >
        <Plus size={12} /> Add
      </button>
    </div>
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2 p-3 bg-white rounded border">
          <div className="flex-1">
            {renderFields(field, index, register, errors)}
          </div>
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 mt-2 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const InfluencerForm = ({ type, data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues = {
    name: data?.name || "",
    categoryInstagram: data?.categoryInstagram || "",
    categoryYouTube: data?.categoryYouTube || "",
    user_name: data?.user_name || "",
    city: data?.city || "",
    state: data?.state || "",
    language: data?.language || "",
    gender: data?.gender || "",
    instagramData: {
      followers: data?.instagramData?.followers || 0,
      genderDistribution: data?.instagramData?.genderDistribution || [],
      ageDistribution: data?.instagramData?.ageDistribution || [],
      audienceByCountry: data?.instagramData?.audienceByCountry || [],
      collaborationCharges: {
        reel: data?.instagramData?.collaborationCharges?.reel || 0,
        story: data?.instagramData?.collaborationCharges?.story || 0,
        post: data?.instagramData?.collaborationCharges?.post || 0,
        oneMonthDigitalRights: data?.instagramData?.collaborationCharges?.oneMonthDigitalRights || 0,
      }
    },
    youtubeData: {
      followers: data?.youtubeData?.followers || 0,
      link: data?.youtubeData?.link || "",
      genderDistribution: data?.youtubeData?.genderDistribution || [],
      ageDistribution: data?.youtubeData?.ageDistribution || [],
      audienceByCountry: data?.youtubeData?.audienceByCountry || [],
      collaborationCharges: {
        reel: data?.youtubeData?.collaborationCharges?.reel || 0,
        story: data?.youtubeData?.collaborationCharges?.story || 0,
        post: data?.youtubeData?.collaborationCharges?.post || 0,
        oneMonthDigitalRights: data?.youtubeData?.collaborationCharges?.oneMonthDigitalRights || 0,
      }
    },
    averageLikes: data?.averageLikes || 0,
    averageViews: data?.averageViews || 0,
    averageComments: data?.averageComments || 0,
    averageEngagement: data?.averageEngagement || 0,
    image: data?.image || "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Field arrays for Instagram dynamic sections
  const {
    fields: instagramGenderFields,
    append: appendInstagramGender,
    remove: removeInstagramGender,
  } = useFieldArray({
    control,
    name: "instagramData.genderDistribution",
  });

  const {
    fields: instagramAgeFields,
    append: appendInstagramAge,
    remove: removeInstagramAge,
  } = useFieldArray({
    control,
    name: "instagramData.ageDistribution",
  });

  const {
    fields: instagramCountryFields,
    append: appendInstagramCountry,
    remove: removeInstagramCountry,
  } = useFieldArray({
    control,
    name: "instagramData.audienceByCountry",
  });

  // Field arrays for YouTube dynamic sections
  const {
    fields: youtubeGenderFields,
    append: appendYoutubeGender,
    remove: removeYoutubeGender,
  } = useFieldArray({
    control,
    name: "youtubeData.genderDistribution",
  });

  const {
    fields: youtubeAgeFields,
    append: appendYoutubeAge,
    remove: removeYoutubeAge,
  } = useFieldArray({
    control,
    name: "youtubeData.ageDistribution",
  });

  const {
    fields: youtubeCountryFields,
    append: appendYoutubeCountry,
    remove: removeYoutubeCountry,
  } = useFieldArray({
    control,
    name: "youtubeData.audienceByCountry",
  });

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    
    try {
      const url = type === "create" 
        ? 'https://api.phyo.ai/api/influencers'
        : `https://api.phyo.ai/api/influencers/${data?.id}`;
        
      const method = type === "create" ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`Influencer ${type}d successfully:`, result);
        alert(`Influencer ${type}d successfully!`);
        
        // Reset form if creating new influencer
        if (type === "create") {
          window.location.reload(); // or use router.push() if using Next.js router
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`Error ${type}ing influencer:`, errorData);
        alert(`Error ${type}ing influencer: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold text-gray-800">
          {type === "create" ? "Create a new influencer" : "Update influencer"}
        </h1>
        
        {/* Basic Information */}
        <div>
          <span className="text-xs text-gray-400 font-medium mb-4 block">Basic Information</span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Name"
              name="name"
              register={register}
              error={errors?.name}
            />
            <InputField
              label="Username"
              name="user_name"
              register={register}
              error={errors?.user_name}
            />
            <InputField
              label="City"
              name="city"
              register={register}
              error={errors?.city}
            />
            <InputField
              label="State"
              name="state"
              register={register}
              error={errors?.state}
            />
            <InputField
              label="Language"
              name="language"
              register={register}
              error={errors?.language}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Gender</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                {...register("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender?.message && (
                <p className="text-xs text-red-400">{errors.gender.message.toString()}</p>
              )}
            </div>
            <InputField
              label="Profile Image URL"
              name="image"
              register={register}
              error={errors?.image}
            />
          </div>
        </div>

        {/* Instagram Information */}
        <div className="border-t pt-6">
          <span className="text-xs text-gray-400 font-medium mb-4 block">Instagram Information</span>
          <div className="space-y-6">
            <div className="flex justify-between flex-wrap gap-4">
              <InputField
                label="Instagram Category"
                name="categoryInstagram"
                register={register}
                error={errors?.categoryInstagram}
              />
              <InputField
                label="Instagram Followers"
                name="instagramData.followers"
                type="number"
                register={register}
                error={errors?.instagramData?.followers}
              />
            </div>

            {/* Instagram Collaboration Charges */}
            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Instagram Collaboration Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField
                  label="Reel Charge ($)"
                  name="instagramData.collaborationCharges.reel"
                  type="number"
                  register={register}
                  error={errors?.instagramData?.collaborationCharges?.reel}
                />
                <InputField
                  label="Story Charge ($)"
                  name="instagramData.collaborationCharges.story"
                  type="number"
                  register={register}
                  error={errors?.instagramData?.collaborationCharges?.story}
                />
                <InputField
                  label="Post Charge ($)"
                  name="instagramData.collaborationCharges.post"
                  type="number"
                  register={register}
                  error={errors?.instagramData?.collaborationCharges?.post}
                />
                <InputField
                  label="Digital Rights ($)"
                  name="instagramData.collaborationCharges.oneMonthDigitalRights"
                  type="number"
                  register={register}
                  error={errors?.instagramData?.collaborationCharges?.oneMonthDigitalRights}
                />
              </div>
            </div>

            {/* Instagram Gender Distribution */}
            <DynamicSection
              title="Instagram Gender Distribution"
              fields={instagramGenderFields}
              onAdd={() => appendInstagramGender({ gender: "", distribution: 0 })}
              onRemove={removeInstagramGender}
              register={register}
              errors={errors}
              renderFields={(field, index, register, errors) => (
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Gender</label>
                    <input
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`instagramData.genderDistribution.${index}.gender`)}
                      placeholder="e.g., Male, Female, Non-binary"
                    />
                    {errors?.instagramData?.genderDistribution?.[index]?.gender && (
                      <p className="text-xs text-red-400">
                        {errors.instagramData.genderDistribution[index].gender.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Distribution (%)</label>
                    <input
                      type="number"
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`instagramData.genderDistribution.${index}.distribution`, { valueAsNumber: true })}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    {errors?.instagramData?.genderDistribution?.[index]?.distribution && (
                      <p className="text-xs text-red-400">
                        {errors.instagramData.genderDistribution[index].distribution.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />

            {/* Instagram Age Distribution */}
            <DynamicSection
              title="Instagram Age Distribution"
              fields={instagramAgeFields}
              onAdd={() => appendInstagramAge({ age: "", value: 0 })}
              onRemove={removeInstagramAge}
              register={register}
              errors={errors}
              renderFields={(field, index, register, errors) => (
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Age Range</label>
                    <input
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`instagramData.ageDistribution.${index}.age`)}
                      placeholder="e.g., 18-24, 25-34, 35-44, 45+"
                    />
                    {errors?.instagramData?.ageDistribution?.[index]?.age && (
                      <p className="text-xs text-red-400">
                        {errors.instagramData.ageDistribution[index].age.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Value (%)</label>
                    <input
                      type="number"
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`instagramData.ageDistribution.${index}.value`, { valueAsNumber: true })}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    {errors?.instagramData?.ageDistribution?.[index]?.value && (
                      <p className="text-xs text-red-400">
                        {errors.instagramData.ageDistribution[index].value.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />

            {/* Instagram Audience by Country */}
            <DynamicSection
              title="Instagram Audience by Country"
              fields={instagramCountryFields}
              onAdd={() => appendInstagramCountry({ category: "country", name: "", value: 0 })}
              onRemove={removeInstagramCountry}
              register={register}
              errors={errors}
              renderFields={(field, index, register, errors) => (
                <div className="flex gap-4">
                  <input
                    type="hidden"
                    {...register(`instagramData.audienceByCountry.${index}.category`)}
                    value="country"
                  />
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Country Name</label>
                    <input
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`instagramData.audienceByCountry.${index}.name`)}
                      placeholder="e.g., United States, Canada, India"
                    />
                    {errors?.instagramData?.audienceByCountry?.[index]?.name && (
                      <p className="text-xs text-red-400">
                        {errors.instagramData.audienceByCountry[index].name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Value (%)</label>
                    <input
                      type="number"
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`instagramData.audienceByCountry.${index}.value`, { valueAsNumber: true })}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    {errors?.instagramData?.audienceByCountry?.[index]?.value && (
                      <p className="text-xs text-red-400">
                        {errors.instagramData.audienceByCountry[index].value.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* YouTube Information */}
        <div className="border-t pt-6">
          <span className="text-xs text-gray-400 font-medium mb-4 block">YouTube Information</span>
          <div className="space-y-6">
            <div className="flex justify-between flex-wrap gap-4">
              <InputField
                label="YouTube Category"
                name="categoryYouTube"
                register={register}
                error={errors?.categoryYouTube}
              />
              <InputField
                label="YouTube Followers"
                name="youtubeData.followers"
                type="number"
                register={register}
                error={errors?.youtubeData?.followers}
              />
              <InputField
                label="YouTube Link"
                name="youtubeData.link"
                register={register}
                error={errors?.youtubeData?.link}
              />
            </div>

            {/* YouTube Collaboration Charges */}
            <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
              <h3 className="text-sm font-medium text-gray-700 mb-4">YouTube Collaboration Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField
                  label="Reel Charge ($)"
                  name="youtubeData.collaborationCharges.reel"
                  type="number"
                  register={register}
                  error={errors?.youtubeData?.collaborationCharges?.reel}
                />
                <InputField
                  label="Story Charge ($)"
                  name="youtubeData.collaborationCharges.story"
                  type="number"
                  register={register}
                  error={errors?.youtubeData?.collaborationCharges?.story}
                />
                <InputField
                  label="Post Charge ($)"
                  name="youtubeData.collaborationCharges.post"
                  type="number"
                  register={register}
                  error={errors?.youtubeData?.collaborationCharges?.post}
                />
                <InputField
                  label="Digital Rights ($)"
                  name="youtubeData.collaborationCharges.oneMonthDigitalRights"
                  type="number"
                  register={register}
                  error={errors?.youtubeData?.collaborationCharges?.oneMonthDigitalRights}
                />
              </div>
            </div>

            {/* YouTube Gender Distribution */}
            <DynamicSection
              title="YouTube Gender Distribution"
              fields={youtubeGenderFields}
              onAdd={() => appendYoutubeGender({ gender: "", distribution: 0 })}
              onRemove={removeYoutubeGender}
              register={register}
              errors={errors}
              renderFields={(field, index, register, errors) => (
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Gender</label>
                    <input
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`youtubeData.genderDistribution.${index}.gender`)}
                      placeholder="e.g., Male, Female, Non-binary"
                    />
                    {errors?.youtubeData?.genderDistribution?.[index]?.gender && (
                      <p className="text-xs text-red-400">
                        {errors.youtubeData.genderDistribution[index].gender.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Distribution (%)</label>
                    <input
                      type="number"
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`youtubeData.genderDistribution.${index}.distribution`, { valueAsNumber: true })}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    {errors?.youtubeData?.genderDistribution?.[index]?.distribution && (
                      <p className="text-xs text-red-400">
                        {errors.youtubeData.genderDistribution[index].distribution.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />

            {/* YouTube Age Distribution */}
            <DynamicSection
              title="YouTube Age Distribution"
              fields={youtubeAgeFields}
              onAdd={() => appendYoutubeAge({ age: "", value: 0 })}
              onRemove={removeYoutubeAge}
              register={register}
              errors={errors}
              renderFields={(field, index, register, errors) => (
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Age Range</label>
                    <input
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`youtubeData.ageDistribution.${index}.age`)}
                      placeholder="e.g., 18-24, 25-34, 35-44, 45+"
                    />
                    {errors?.youtubeData?.ageDistribution?.[index]?.age && (
                      <p className="text-xs text-red-400">
                        {errors.youtubeData.ageDistribution[index].age.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Value (%)</label>
                    <input
                      type="number"
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`youtubeData.ageDistribution.${index}.value`, { valueAsNumber: true })}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    {errors?.youtubeData?.ageDistribution?.[index]?.value && (
                      <p className="text-xs text-red-400">
                        {errors.youtubeData.ageDistribution[index].value.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />

            {/* YouTube Audience by Country */}
            <DynamicSection
              title="YouTube Audience by Country"
              fields={youtubeCountryFields}
              onAdd={() => appendYoutubeCountry({ category: "country", name: "", value: 0 })}
              onRemove={removeYoutubeCountry}
              register={register}
              errors={errors}
              renderFields={(field, index, register, errors) => (
                <div className="flex gap-4">
                  <input
                    type="hidden"
                    {...register(`youtubeData.audienceByCountry.${index}.category`)}
                    value="country"
                  />
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Country Name</label>
                    <input
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`youtubeData.audienceByCountry.${index}.name`)}
                      placeholder="e.g., United States, Canada, India"
                    />
                    {errors?.youtubeData?.audienceByCountry?.[index]?.name && (
                      <p className="text-xs text-red-400">
                        {errors.youtubeData.audienceByCountry[index].name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs text-gray-500">Value (%)</label>
                    <input
                      type="number"
                      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register(`youtubeData.audienceByCountry.${index}.value`, { valueAsNumber: true })}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    {errors?.youtubeData?.audienceByCountry?.[index]?.value && (
                      <p className="text-xs text-red-400">
                        {errors.youtubeData.audienceByCountry[index].value.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="border-t pt-6">
          <span className="text-xs text-gray-400 font-medium mb-4 block">Engagement Metrics</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Average Likes"
              name="averageLikes"
              type="number"
              register={register}
              error={errors?.averageLikes}
            />
            <InputField
              label="Average Views"
              name="averageViews"
              type="number"
              register={register}
              error={errors?.averageViews}
            />
            <InputField
              label="Average Comments"
              name="averageComments"
              type="number"
              register={register}
              error={errors?.averageComments}
            />
            <InputField
              label="Average Engagement (%)"
              name="averageEngagement"
              type="number"
              inputProps={{ step: "0.1" }}
              register={register}
              error={errors?.averageEngagement}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6">
          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {type === "create" ? "Creating..." : "Updating..."}
              </div>
            ) : (
              type === "create" ? "Create Influencer" : "Update Influencer"
            )}
          </button>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="border-t pt-6">
            <details className="bg-gray-100 p-4 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-600">
                Debug Info (Development Only)
              </summary>
              <div className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                {Object.entries(errors).map(([key, error]) => (
                  <div key={key} className="mb-1">
                    <strong>{key}:</strong> {error?.message || 'Unknown error'}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </form>
    </div>
  );
};

export default InfluencerForm;