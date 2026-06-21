using FluentValidation;

namespace ALTA.Common.Validation
{
    public static class ValidationExtensions
    {
        /// <summary>
        /// Validates <paramref name="instance"/> and returns the list of error
        /// messages, or <c>null</c> when the instance is valid.
        /// </summary>
        public static List<string>? GetErrors<T>(this IValidator<T> validator, T instance)
        {
            var result = validator.Validate(instance);
            return result.IsValid
                ? null
                : result.Errors.Select(e => e.ErrorMessage).ToList();
        }
    }
}
